#!/usr/bin/env python
# coding: utf-8

# ## M7_Convert_LIVE
# 
# New notebook

# **Ingesting cleaned up production table and wbs project table for M7 analysis**

# Creating two dataframes to store the data from both tables

# In[6]:


# Welcome to your new notebook
# Type here in the cell editor to add code!
from pyspark.sql.functions import *
from pyspark.sql.types import *

prod_df = spark.sql("SELECT * FROM d365_prod.ProdTable")

proj_df = spark.sql("SELECT * FROM d365_prod.ProjPlanTable")

new_df = prod_df


# Creating a new dataframe that joins the "Group", "Duration", "EffortInHours" columns from the wbsprojtable to the production table
# 
# This is done by comparing the project and subproject indicated between the two tables

# In[7]:


new_df = new_df.join(proj_df, [new_df.Proj == proj_df.Proj, new_df.SubProj == proj_df.SubProj]).select(new_df["*"],proj_df["Group"],proj_df["Duration"],proj_df["EffortInHours"])


# From the new dataframe the group column is used to indicate which M7 ECD is correct from the wbsproj table and is joined to the new dataframe

# In[3]:


new_df = new_df.alias("A").join(proj_df.alias("B"), [new_df.Group == proj_df.Group, proj_df.Proj == "M7"],'left').select(col("A.*"),col("B.ECDDate"))


# Changing the data types to match better to the data

# In[4]:


new_df = new_df.withColumn("ECDDate",col("ECDDate").cast(DateType()))
new_df = new_df.withColumn("Created",col("Created").cast(DateType()))
new_df = new_df.withColumn("ImportDate",col("ImportDate").cast(DateType()))
#display(new_df)


# Create/overwrite a new table in datalake with the new dataframe

# In[5]:


delta_table_path = "Tables/M7Table" #fill in your delta table path 
new_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

