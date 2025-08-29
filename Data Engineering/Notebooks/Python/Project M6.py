#!/usr/bin/env python
# coding: utf-8

# ## Project M6
# 
# New notebook

# In[1]:


from pyspark.sql.functions import *
from pyspark.sql.types import *

taskdf = spark.sql("SELECT * FROM OnePlan.Tasks")


# In[2]:


taskdf = taskdf.select(
        col('MSPWBS'),\
        col('WBS').alias('wbs'),\
        col('Name'),\
        col('Modified'),\
        col('Status'),\
        col('State'),\
        col('Priority'),\
        col('TaskStatus'),\
        col('RemainingEffort'),\
        col('StartDate'),\
        col('EndDate'),\
        col('Effort'),\
        col('Duration'),\
        col('Id'),\
    )
taskdf = taskdf.filter(taskdf.Name.contains('M6'))


# In[3]:


display(taskdf)


# In[4]:


delta_table_path_m6 = "Tables/M6_Task"
taskdf.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path_m6)

