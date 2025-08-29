#!/usr/bin/env python
# coding: utf-8

# ## OnePlan_Cleanup
# 
# New notebook

# In[1]:


from pyspark.sql.functions import *
from pyspark.sql.types import *

projectdf = spark.sql("SELECT * FROM OnePlan.Plan_Project")
taskdf = spark.sql("SELECT * FROM OnePlan.Tasks")
capdf = spark.sql("SELECT * FROM OnePlan.Capacity")


# In[2]:


#display(capdf)
#display(projectdf)


# In[3]:


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
taskdf = taskdf.filter(taskdf.Name.contains('M7'))
#display(taskdf)


# In[4]:


delta_table_path_project = "Tables/Project_Clean"
projectdf.write.format("delta").mode("overwrite").option("overwriteSchema","true").save(delta_table_path_project)

