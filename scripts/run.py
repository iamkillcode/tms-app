import pandas as pd
import json
import os

# Define the path to the Excel file and the output JSON file
excel_file_path = 'category.xlsx'
json_file_path = '../tms-backend/assets/categories.json'

# Read the Excel file, skipping the first row
df = pd.read_excel(excel_file_path, skiprows=1)

# Rename the columns to 'Category Code' and 'Category Description'
df.columns = ['Category Code', 'Category Description']

# Convert the DataFrame to a list of dictionaries
data = df.to_dict(orient='records')

# Write the data to a JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(data, json_file, indent=4)

print(f"Category codes and descriptions have been extracted to {json_file_path}")