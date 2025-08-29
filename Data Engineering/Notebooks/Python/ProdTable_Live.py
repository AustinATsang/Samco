#!/usr/bin/env python
# coding: utf-8

# ## ProdTable_Live
# 
# New notebook

# **Ingesting production table for production order analysis**

# In[1]:


from pyspark.sql.functions import *
from pyspark.sql.types import *
new_df = spark.sql("SELECT * FROM d365_prod.ProdTable")


# In[2]:


#display(new_df)


# Changing the data types to match better to the data

# In[3]:


new_df = new_df.withColumn("Created",col("Created").cast(DateType()))
new_df = new_df.withColumn("ImportDate",col("ImportDate").cast(DateType()))
new_df = new_df.withColumn('ReleaseDate',col('ReleaseDate').cast(DateType()))
new_df = new_df.withColumn('EstimateDate',col('EstimateDate').cast(DateType()))


# In[4]:


new_df = new_df.filter(col('Production').startswith('PD-'))


# Replacing default with blank value 

# In[6]:


new_df = new_df.withColumn('ReleaseDate', 
    when(col('ReleaseDate') == lit("1900-01-01").cast(DateType()), None)
    .otherwise(col('ReleaseDate'))
)
new_df = new_df.withColumn('EstimateDate', 
    when(col('EstimateDate') == lit("1900-01-01").cast(DateType()), None)
    .otherwise(col('EstimateDate'))
)


# Replacing data with more digestible names

# In[8]:


new_df = new_df.withColumn('Status', regexp_replace('Status', '0','Created'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '1','Estimated'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '2','Scheduled'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '3','Released'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '4','Started'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '5','Reported as finished'))
new_df = new_df.withColumn('Status', regexp_replace('Status', '7','Ended'))


# In[6]:


filtered_df = new_df.filter(new_df.is_valid_date != True) #& (new_df.ReleaseDate != None))

#display(filtered_df)


# In[9]:


new_df = new_df.sort(new_df['Production'].desc())
#display(new_df)


# In[10]:


delta_table_path = "Tables/ProdTable_Live" #fill in your delta table path 
new_df.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path)

