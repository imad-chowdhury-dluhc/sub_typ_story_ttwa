''' Initiate script '''
# Import packages
import pandas as pd
import geopandas
import random

# Define useful objects
path = 'public/data/'
path2 = path + 'geojsons/'
q_drive = 'Q:/SDU/Jac/subnational_typologies/resources/'


''' Create new geojson files '''
# Download data
shp = geopandas.read_file(f'{path2}BUA22.geojson')

# Generate dummy Blackpool KNN data
df = pd.DataFrame({
    'BUA22CD' : ['E63000792'] + random.sample([x for x in shp.BUA22CD if x != 'E06000009'],9),
    'KNN' : [x for x in range(10)]
})
df = shp[['BUA22CD','BUA22NM']].merge(df)
df.columns = ['code','name','KNN']
df.sort_values(by='KNN').reset_index(drop=True).to_csv(f'{path}data_KNN.csv')

# Filter shape file to the 55 towns 
shp = shp[[True if df.code.tolist().count(x) > 0 else False for x in shp.BUA22CD]].reset_index(drop=True)

# Save to file
shp.to_file(f'{path2}BUA22_KNN.geojson', driver="GeoJSON")
