#!/usr/bin/env python
# coding: utf-8

# ## ECR_List_Cleanup_Live
# 
# New notebook

# **Notebook to cleanup ECR data from ECR List on Sharepoint**

# In[1]:


from pyspark.sql.functions import*
from pyspark.sql.types import StructType,StructField,StringType,ArrayType,IntegerType

df = spark.sql("SELECT * FROM sharepoint_ecr_list.ECR_List")
df = df.sort(df['ECR_#'].desc())
#display(df)


# JSON schema for project and subproject

# In[2]:


products_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Project',StringType(),True))\
    .add(StructField('Subproject',StringType(),True))
)


# In[3]:


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

# In[4]:


newdf = df.select(
    col('Title').alias('ECR#'),\
    col('Urgency_Mech'),\
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
    col('NCR#')
)

#display(newdf)


# Splitting the Products_Mech to projects and subprojects columns

# In[5]:


#newdf = newdf.withColumn('ID', col('Products_Mech.__id'))
newdf = newdf.withColumn('Project', col('Products_Mech.Project'))
newdf = newdf.withColumn('Subproject', col('Products_Mech.Subproject'))
#display(newdf)


# In[6]:


delta_table_path = "Tables/ECR_List_Clean" #fill in your delta table path 
newdf.write.format("delta").mode("overwrite").option('overwriteSchema','true').save(delta_table_path)


# In[7]:


'''
df = df.withColumn('Products_Mech',regexp_replace('Products_Mech','[\[\]]',''))
df = df.withColumn('Products_Added_Mech',regexp_replace('Products_Added_Mech','[\[\]]',''))
df = df.withColumn('Products_Removed_Mech',regexp_replace('Products_Removed_Mech','[\[\]]',''))
df = df.withColumn('Drawing_Mech',regexp_replace('Drawing_Mech','[\[\]]',''))
#display(df)
'''

'''
newdf = df.withColumn('Stage_Mech',col('Stage_Mech'))
newdf = df.withColumn('Created',col('Created'))
newdf = df.withColumn('Modified',col('Modified'))
newdf = df.withColumn('Project_Leader_Sign_Mech',col('Project_Leader_Sign_Mech'))
newdf = df.withColumn('ECR_Completed_Sign_Mech',col('ECR_Completed_Sign_Mech'))
newdf = df.withColumn('Review_Project_Leader_Sign_Mech',col('Review_Project_Leader_Sign_Mech'))
newdf = df.withColumn('Docu_Control_Leader_Sign_Mech',col('Docu_Control_Leader_Sign_Mech'))
newdf = df.withColumn('Docu_Control_Admin_Sign_Mech',col('Docu_Control_Admin_Sign_Mech'))
newdf = df.withColumn('NCR#',col('NCR#'))
'''

'''
#newdf = newdf.withColumn('Products_Added', concat(lit('['), col('Products_Added'), lit(']')))
#newdf = newdf.withColumn('Products_Added',regexp_replace('Products_Added','[\[\]]',''))
newdf = newdf.withColumn('Products_Added',from_json(col('Products_Added'),added_schema))
'''


# In[8]:


'''
adf = newdf.select(json_tuple(col("Products_Mech"),"__id","Project","Subproject")).toDF("id","Project","Subproject")
display(newdf)
#df.withColumn('Products_Mech', from_json(df.Products_Mech,MapType(StringType(),)))
'''

