#!/usr/bin/env python
# coding: utf-8

# ## ProdTable_Cleanup_LIVE
# 
# New notebook

# **Ingesting production table from D365 Finance and Operations and extracting columns we need for M7 analysis.**

# In[1]:


from pyspark.sql.functions import *

df = spark.read.format("csv")\
    .option("quote","\"")\
    .option("escape","\"")\
    .option("multiline",True)\
    .option("delimeter",",")\
    .load("Files/Tables/SupplyChain/ProductionControl/WorksheetHeader/ProdTable/PRODTABLE_00001.csv")
# df now is a Spark DataFrame containing CSV data from "Files/Tables/SupplyChain/ProductionControl/WorksheetHeader/ProdTable/PRODTABLE_00001.csv".


# In[2]:


#df = df.sort(df['_c53'].desc())
#display(df)


# Creating a new dataframe that only contains the columns we need from the production table

# In[23]:


renamed_df = df.select(
                col("_c61").alias("ProjectID"),\
                col("_c53").alias("Production"),\
                col("_c6").alias("ItemNumber"),\
                col("_c7").alias("Name"),\
                col("_c15").alias("Quantity"),\
                col("_c85").alias("Created"),\
                col('_c9').alias('Status'),\
                col("_c39").alias("Pool"),\
                col("_c63").alias("ProjectCategory"),\
                col("_c0").alias("ID"),\
                col("_c3").alias("ImportDate"),\
                col('_c52').alias("ReleaseDate"),\
                col('_c41').alias('EstimateDate'))


# Sorting by most recent production

# In[24]:


renamed_df = renamed_df.sort(renamed_df['Production'].desc())
#display(renamed_df)


# Splitting the project id into project and subproject and rebuilding the dataframe

# In[25]:


split_col = split(renamed_df['ProjectID'],'-')
renamed_df = renamed_df.withColumn('Proj', split_col.getItem(0))
renamed_df = renamed_df.withColumn('SubProj', split_col.getItem(1))

renamed_df = renamed_df.select(
                "Proj",\
                "SubProj",\
                "Production",\
                "ItemNumber",\
                "Name",\
                "Quantity",\
                "Created",\
                'Status',\
                "Pool",\
                "ProjectCategory",\
                "ID",\
                "ImportDate",\
                'ReleaseDate',\
                'EstimateDate')

#display(renamed_df)


# Create/overwrite a new table in datalake with the new dataframe

# In[26]:


delta_table_path = "Tables/ProdTable" #fill in your delta table path 
renamed_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

