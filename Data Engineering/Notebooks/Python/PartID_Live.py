#!/usr/bin/env python
# coding: utf-8

# ## PartID_Live
# 
# New notebook

# In[1]:


from pyspark.sql.functions import *
from pyspark.sql.types import *
df = spark.sql("SELECT * FROM d365_prod.PartIDTable")


# In[2]:


df = df.withColumn("CreatedDate",col("CreatedDate").cast(DateType()))
df = df.withColumn("ModifiedDate",col("ModifiedDate").cast(DateType()))


# In[3]:


display(df)


# In[5]:


delta_table_path = "Tables/PartIDTable_Live" #fill in your delta table path 
df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

