#!/usr/bin/env python
# coding: utf-8

# ## ECR_List_Cleanup_Live
# 
# New notebook

# **Notebook to cleanup ECR data from ECR List on Sharepoint**

# In[31]:


from pyspark.sql.functions import*
from pyspark.sql.types import StructType,StructField,StringType,ArrayType,IntegerType

df = spark.sql("SELECT * FROM sharepoint_ecr_list.ECR_List_Raw")
df = df.sort(df['ECR_#'].desc())
#display(df)


# JSON schema for project and subproject

# In[32]:


products_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Project',StringType(),True))\
    .add(StructField('Subproject',StringType(),True))
)


# In[33]:


added_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Product',StringType(),True))\
    .add(StructField('Drawing',StringType(),True))\
    .add(StructField('Description',StringType(),True))\
    .add(StructField('Qty',IntegerType(),True))\
    .add(StructField('Prod',StringType(),True))
)


# Selecting the required columns for data analysis

# In[34]:


newdf = df.select(
    col('Title').alias('ECR#'),\
    col('Urgency_Code_Mech'),\
    explode(from_json(col('Products_Mech'),products_schema)).alias('Products_Mech'),\
    col('Products_Added_Mech').alias('Products_Added'),\
    col('Stage_Mech'),\
    col('Created'),\
    col('Modified'),\
    col('Project_Leader_Sign_Mech'),\
    col('ECR_Completed_Sign_Mech'),\
    col('Review_Project_Leader_Sign_Mech'),\
    col('Docu_Control_Leader_Sign_Mech'),\
    col('Docu_Control_Admin_Sign_Mech'),\
    col('NCR#'),\
    col('Total#ofFolders')
)

#display(newdf)


# Splitting the Products_Mech to projects and subprojects columns

# In[35]:


#newdf = newdf.withColumn('ID', col('Products_Mech.__id'))
newdf = newdf.withColumn('Project', col('Products_Mech.Project'))
newdf = newdf.withColumn('Subproject', col('Products_Mech.Subproject'))
#display(newdf)


# Formatting the Project and Subproject columns to identify all the projects and subprojects involved in the ECR

# In[36]:


newdf = newdf.withColumn('Project',trim(newdf.Project))
newdf = newdf.withColumn('Project',split('Project','[/,&;]'))
newdf = newdf.withColumn('Project',explode('Project'))
newdf = newdf.withColumn('Subproject',trim(newdf.Subproject))
newdf = newdf.withColumn('Subproject',split('Subproject','[/]'))
newdf = newdf.withColumn('Subproject',explode('Subproject'))
#display(newdf)


# In[37]:


delta_table_path = "Tables/ECR_List_Clean" #fill in your delta table path 
newdf.write.format("delta").mode("overwrite").option('overwriteSchema','true').save(delta_table_path)

