#!/usr/bin/env python
# coding: utf-8

# ## PartIDTable_Cleanup
# 
# New notebook

# **Ingesting part id table from D365 Finance and Operations and extracting columns we need for M7 analysis.**

# In[4]:


from pyspark.sql.functions import *

df = spark.read.format("csv")\
    .option("quote","\"")\
    .option("escape","\"")\
    .option("multiline",True)\
    .option("delimeter",",")\
    .load("Files/Tables/SupplyChain/ProductInformationManagement/Main/InventTable/INVENTTABLE_00001.csv")


# In[5]:


renamed_df = df.select(
                col("_c5").alias("PartID"),\
                col("_c13").alias("Vendor"),\
                col("_c11").alias("CostGroup"),\
                col("_c17").alias("Unit"),\
                col("_c17").alias("Cost"),\
                col("_c46").alias("CommodityCode"),\
                col("_c76").alias("CalculationGroup"),\
                col('_c92').alias('ModifiedDate'),\
                col('_c93').alias('CreatedDate'),\
                col("_c96").alias("DrawingID"),\
                col("_c98").alias("Revision"),\
                col("_c99").alias("Maufacturer"),\
                col("_c100").alias("MFGPartID"),\
                col("_c134").alias("ModifiedBy"),\
                col("_c135").alias("CreatedBy"))


# In[6]:


renamed_df = renamed_df.withColumn('CreatedBy', lower(renamed_df['CreatedBy']))
renamed_df = renamed_df.withColumn('ModifiedBy', lower(renamed_df['ModifiedBy']))


# In[7]:


delta_table_path = "Tables/PartIDTable" #fill in your delta table path 
renamed_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

