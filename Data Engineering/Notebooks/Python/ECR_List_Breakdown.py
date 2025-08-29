#!/usr/bin/env python
# coding: utf-8

# ## ECR_List_Breakdown
# 
# New notebook

# **Notebook to cleanup ECR data from ECR List on Sharepoint**

# In[152]:


from pyspark.sql.functions import*
from pyspark.sql.types import StructType,StructField,StringType,ArrayType,IntegerType

df = spark.sql("SELECT * FROM sharepoint_ecr_list.ECR_List_Raw")
df = df.sort(df['ECR_#'].desc())
#display(df)


# JSON schema for project and subproject

# In[153]:


products_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Project',StringType(),True))\
    .add(StructField('Subproject',StringType(),True))
)


# In[154]:


added_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Product',StringType(),True))\
    .add(StructField('Drawing',StringType(),True))\
    .add(StructField('Description',StringType(),True))\
    .add(StructField('Qty',StringType(),True))\
    .add(StructField('Prod',StringType(),True))
)


# In[155]:


removed_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Product',StringType(),True))\
    .add(StructField('Drawing',StringType(),True))\
    .add(StructField('Description',StringType(),True))\
    .add(StructField('Qty',StringType(),True))\
    .add(StructField('Prod',StringType(),True))
)


# In[156]:


drawing_schema = ArrayType(
    StructType()
    .add(StructField('__id',StringType(),True))\
    .add(StructField('Product',StringType(),True))\
    .add(StructField('Drawing',StringType(),True))\
    .add(StructField('Current',IntegerType(),True))\
    .add(StructField('Ref',StringType(),True))\
    .add(StructField('New',IntegerType(),True))\
    .add(StructField('Prod',StringType(),True))\
    .add(StructField('Column1',StringType(),True))
)


# Selecting the required columns for data analysis

# In[157]:


newdf = df.select(
    col('Title').alias('ECR#'),\
    col('Urgency_Code_Mech'),\
    col('Products_Mech'),\
    col('Products_Added_Mech').alias('Products_Added'),\
    col('Products_Added_Mech_2').alias('Products_Added_2'),\
    col('Products_Added_Mech_3').alias('Products_Added_3'),\
    col('Products_Added_Mech_4').alias('Products_Added_4'),\
    col('Products_Added_Mech_5').alias('Products_Added_5'),\
    col('Products_Added_Mech_6').alias('Products_Added_6'),\
    col('Products_Removed_Mech').alias('Products_Removed'),\
    col('Products_Removed_Mech_2').alias('Products_Removed_2'),\
    col('Products_Removed_Mech_3').alias('Products_Removed_3'),\
    col('Products_Removed_Mech_4').alias('Products_Removed_4'),\
    col('Products_Removed_Mech_5').alias('Products_Removed_5'),\
    col('Products_Removed_Mech_6').alias('Products_Removed_6'),\
    col('Drawing_Mech'),\
    col('Drawing_Mech_2'),\
    col('Drawing_Mech_3'),\
    col('Drawing_Mech_4'),\
    col('Drawing_Mech_5'),\
    col('Drawing_Mech_6'),\
    col('Stage_Mech'),\
    col('Created'),\
    col('Modified'),\
    col('Project_Leader_Sign_Mech'),\
    col('ECR_Completed_Sign_Mech'),\
    col('Review_Project_Leader_Sign_Mech'),\
    col('Docu_Control_Leader_Sign_Mech'),\
    col('Docu_Control_Admin_Sign_Mech'),\
    col('NCR#'),\
    col('Total#ofFolders'),\
    col('ReasonforECR0').alias('Reason_For_ECR'),\
    col('CostCategory')
)


# In[158]:


newdf = newdf.withColumn('Products_Mech', explode_outer(from_json(col('Products_Mech'),products_schema)))\
             .withColumn('Products_Added', explode_outer(from_json(col('Products_Added'),added_schema)))\
             .withColumn('Products_Added_2', explode_outer(from_json(col('Products_Added_2'),added_schema)))\
             .withColumn('Products_Added_3', explode_outer(from_json(col('Products_Added_3'),added_schema)))\
             .withColumn('Products_Added_4', explode_outer(from_json(col('Products_Added_4'),added_schema)))\
             .withColumn('Products_Added_5', explode_outer(from_json(col('Products_Added_5'),added_schema)))\
             .withColumn('Products_Added_6', explode_outer(from_json(col('Products_Added_6'),added_schema)))\
             .withColumn('Drawing_Mech', explode_outer(from_json(col('Drawing_Mech'),drawing_schema)))\
             .withColumn('Drawing_Mech_2', explode_outer(from_json(col('Drawing_Mech_2'),drawing_schema)))\
             .withColumn('Drawing_Mech_3', explode_outer(from_json(col('Drawing_Mech_3'),drawing_schema)))\
             .withColumn('Drawing_Mech_4', explode_outer(from_json(col('Drawing_Mech_4'),drawing_schema)))\
             .withColumn('Drawing_Mech_5', explode_outer(from_json(col('Drawing_Mech_5'),drawing_schema)))\
             .withColumn('Drawing_Mech_6', explode_outer(from_json(col('Drawing_Mech_6'),drawing_schema)))\
             .withColumn('Products_Removed', explode_outer(from_json(col('Products_Removed'),removed_schema)))\
             .withColumn('Products_Removed_2', explode_outer(from_json(col('Products_Removed_2'),removed_schema)))\
             .withColumn('Products_Removed_3', explode_outer(from_json(col('Products_Removed_3'),removed_schema)))\
             .withColumn('Products_Removed_4', explode_outer(from_json(col('Products_Removed_4'),removed_schema)))\
             .withColumn('Products_Removed_5', explode_outer(from_json(col('Products_Removed_5'),removed_schema)))\
             .withColumn('Products_Removed_6', explode_outer(from_json(col('Products_Removed_6'),removed_schema)))


# In[159]:


newdf = newdf.withColumn('Drawing_Mech', struct(col('Drawing_Mech'), col('Drawing_Mech_2'), col('Drawing_Mech_3'), col('Drawing_Mech_4'), col('Drawing_Mech_5'), col('Drawing_Mech_6')))\
             .withColumn('Products_Added', struct(col('Products_Added'), col('Products_Added_2'), col('Products_Added_3'), col('Products_Added_4'), col('Products_Added_5'), col('Products_Added_6')))\
             .withColumn('Products_Removed', struct(col('Products_Removed'), col('Products_Removed_2'), col('Products_Removed_3'), col('Products_Removed_4'), col('Products_Removed_5'), col('Products_Removed_6')))


# In[160]:


display(newdf)


# Splitting the Products_Mech to projects and subprojects columns

# In[161]:


#newdf = newdf.withColumn('ID', col('Products_Mech.__id'))
newdf = newdf.withColumn('Project', col('Products_Mech.Project'))
newdf = newdf.withColumn('Subproject', col('Products_Mech.Subproject'))
#display(newdf)


# In[162]:


newdf = newdf.withColumn('PAdded_Product', col('Products_Added.*.Product'))\
             .withColumn('PAdded_Drawing', col('Products_Added.*.Drawing'))\
             .withColumn('PAdded_Description', col('Products_Added.*.Description'))\
             .withColumn('PAdded_Quantity', col('Products_Added.*.Qty'))\
             .withColumn('PAdded_Production', col('Products_Added.*.Prod'))


# In[ ]:


newdf = newdf.withColumn('PRemoved_Product', col('Products_Removed.*.Product'))\
             .withColumn('PRemoved_Drawing', col('Products_Removed.*.Drawing'))\
             .withColumn('PRemoved_Description', col('Products_Removed.*.Description'))\
             .withColumn('PRemoved_Quantity', col('Products_Removed.*.Qty'))\
             .withColumn('PRemoved_Production', col('Products_Removed.*.Prod'))


# In[ ]:


newdf = newdf.withColumn('DrInfo_Product', col('Drawing_Mech.*.Product'))\
             .withColumn('DrInfo_Drawing', col('Drawing_Mech.*.Drawing'))\
             .withColumn('DrInfo_CurRev', col('Drawing_Mech.*.Current'))\
             .withColumn('DrInfo_RefPD', col('Drawing_Mech.*.Ref'))\
             .withColumn('DrInfo_NewRev', col('Drawing_Mech.*.New'))\
             .withColumn('DrInfo_PD', col('Drawing_Mech.*.Prod'))\
             .withColumn('DrInfo_POCost', col('Drawing_Mech.*.Column1'))


# Formatting the Project and Subproject columns to identify all the projects and subprojects involved in the ECR

# In[ ]:


newdf = newdf.withColumn('Project',trim(newdf.Project))\
             .withColumn('Project',split('Project','[/,&;]'))\
             .withColumn('Project',explode('Project'))\
             .withColumn('Subproject',trim(newdf.Subproject))\
             .withColumn('Subproject',split('Subproject','[/,]'))\
             .withColumn('Subproject',explode('Subproject'))\
             .withColumn('Subproject',substring_index('Subproject',' (',1))
#display(newdf)


# In[ ]:


cleandf = newdf.select(
    col('ECR#'),\
    col('Urgency_Code_Mech'),\
    #col('Products_Added'),\
    #col('Drawing_Mech'),\
    col('Stage_Mech'),\
    col('Created'),\
    col('Modified'),\
    col('Project_Leader_Sign_Mech'),\
    col('ECR_Completed_Sign_Mech'),\
    col('Review_Project_Leader_Sign_Mech'),\
    col('Docu_Control_Leader_Sign_Mech'),\
    col('Docu_Control_Admin_Sign_Mech'),\
    col('NCR#'),\
    col('Total#ofFolders'),\
    col('Reason_For_ECR'),\
    col('Project'),\
    col('Subproject'),\
    col('PAdded_Product'),\
    col('PAdded_Drawing'),\
    col('PAdded_Description'),\
    col('PAdded_Quantity'),\
    col('PAdded_Production'),\
    col('PRemoved_Product'),\
    col('PRemoved_Drawing'),\
    col('PRemoved_Description'),\
    col('PRemoved_Quantity'),\
    col('PRemoved_Production'),\
    col('DrInfo_Product'),\
    col('DrInfo_Drawing'),\
    col('DrInfo_CurRev'),\
    col('DrInfo_RefPD'),\
    col('DrInfo_NewRev'),\
    col('DrInfo_PD'),\
    col('DrInfo_POCost'),\
    col('CostCategory')
)
display(cleandf)


# In[ ]:


delta_table_path = "Tables/ECR_List_Breakdown" #fill in your delta table path 
cleandf.write.format("delta").mode("overwrite").option('overwriteSchema','true').save(delta_table_path)

