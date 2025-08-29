#!/usr/bin/env python
# coding: utf-8

# ## Calculation_Live
# 
# New notebook

# In[1]:


from pyspark.sql.functions import *
from pyspark.sql.types import *
df = spark.read.format("csv")\
    .option("quote","\"")\
    .option("escape","\"")\
    .option("multiline",True)\
    .option("delimeter",",")\
    .option("pathGlobFilter", "{*.csv}")\
    .option("recursiveFileLookup", "true")\
    .load("Files/Tables/SupplyChain/ProductionControl/Transaction/ProdCalcTrans")
# df now is a Spark DataFrame containing CSV data from "Files/Tables/SupplyChain/ProductionControl/Transaction/ProdCalcTrans". All csv files


# In[2]:


df = df.sort(df['_c5'].desc())


# In[ ]:


testdf = df.filter(df._c5 == 'PD-1233322')
display(testdf)


# In[4]:


renamed_df = df.select(
                col("_c5").alias("Production"),\
                col("_c6").alias("Level"),\
                col("_c8").alias("Type"),\
                #Type Legend (0 = Production, 1 = Item, 2 = BOM, 3 = SubContract, 4 = Setup, 5 = Process) 
                col("_c11").alias("SubProduction"),\
                col("_c13").alias("CostGroup"),\
                col("_c15").alias("EstimatedProcessCost"),\
                col("_c16").alias("EstimatedSetupCost"),\
                col("_c19").alias("Date"),\
                col("_c20").alias("ItemResource"),\
                #col("_c24").alias("ConsumptionPerUnit"),\
                col("_c28").alias("RealizedCostAmount"),\
                col("_c32").alias("OperationNo"),\
                col("_c34").alias("Number")
                )


# In[5]:


renamed_df = renamed_df.withColumn("Date",col("Date").cast(DateType()))


# In[6]:


renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '0','Production'))
renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '1','Item'))
renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '2','Process'))
renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '3','SubContract'))
renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '4','Setup'))
renamed_df = renamed_df.withColumn('Type', regexp_replace('Type', '5','Process'))


# In[7]:


renamed_df = renamed_df.withColumn('EstimatedProcessCost', round(renamed_df['EstimatedProcessCost'],2))
renamed_df = renamed_df.withColumn('EstimatedSetupCost', round(renamed_df['EstimatedSetupCost'],2))
renamed_df = renamed_df.withColumn('RealizedCostAmount', round(renamed_df['RealizedCostAmount'],2))


# In[8]:


#display(renamed_df)


# In[9]:


delta_table_path = "Tables/ProdCostingTable" #fill in your delta table path 
renamed_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

