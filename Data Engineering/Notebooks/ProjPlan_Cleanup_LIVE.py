#!/usr/bin/env python
# coding: utf-8

# ## ProjPlan_Cleanup_LIVE
# 
# New notebook

# **Ingesting project work breakdown structure from D365 Finance and Operations and extracting columns we need for M7 analysis**

# In[22]:


# Welcome to your new notebook
# Type here in the cell editor to add code!
from pyspark.sql.functions import *

df = spark.read.format("csv").load("Files/Tables/ProfessionalServices/ProjectManagementAndAccounting/Group/ProjPlanVersion/PROJPLANVERSION_00001.csv")
# df now is a Spark DataFrame containing CSV data from "Files/Tables/ProfessionalServices/ProjectManagementAndAccounting/Group/ProjPlanVersion/PROJPLANVERSION_00001.csv".
#display(df)


# Creating a new dataframe that only contains the columns we need from the project work breakdown structure table

# In[23]:


renamed_df = df.select(
                col("_c7").alias("ProjectID"),\
                col("_c11").alias("ECDDate"),\
                col("_c5").alias("Group"),\
                col("_c3").alias("ImportDate"),\
                col("_c12").alias("Duration"),\
                col("_c13").alias("EffortInHours"))


# Splitting the project id into project and subproject

# In[24]:


split_col = split(renamed_df['ProjectID'],'-')
renamed_df = renamed_df.withColumn('Proj', split_col.getItem(0))
renamed_df = renamed_df.withColumn('SubProj', split_col.getItem(1))


# Sorting by ECD date and rebuilding the dataframe

# In[25]:


renamed_df = renamed_df.sort(renamed_df['ECDDate'].desc())

renamed_df = renamed_df.select(
                "Proj",\
                "SubProj",\
                "ECDDate",\
                "Group",\
                "ImportDate",\
                "Duration",\
                "EffortInHours")

#display(renamed_df)


# Create/overwrite a new table in datalake with the new dataframe

# In[26]:


delta_table_path = "Tables/ProjPlanTable" #fill in your delta table path 
renamed_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

