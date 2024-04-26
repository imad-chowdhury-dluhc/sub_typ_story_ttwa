export const themes = {
    'light': {
      'text': '#222',
      'muted': '#777',
      'pale': '#f0f0f0',
      'background': '#fff'
    },
    'dark': {
      'text': '#fff',
      'muted': '#bbb',
      'pale': '#333',
      'background': '#222'
    },
    'lightblue': {
      'text': '#206095',
      'muted': '#707070',
      'pale': '#f0f0f0',
      'background': 'rgb(188, 207, 222)'
    }
  }


  export const colors = {
    seq_2: ['#a1dab4','#253494'],
    seq_4: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8'],
    seq_5: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
    seq_tr_20: ['rgba(255,255,204,0.3)','rgba(161,218,180,0.3)','rgba(65,182,196,0.3)','rgba(44,127,184,0.3)','rgba(37,52,148,0.3)'],
    seq_tr: ['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)'],
    seq_5_r: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'].reverse(),
    seq_tr_20_r: ['rgba(255,255,204,0.3)','rgba(161,218,180,0.3)','rgba(65,182,196,0.3)','rgba(44,127,184,0.3)','rgba(37,52,148,0.3)'].reverse(),
    seq_2: ['#ffffbf', '#d7191c'], //A binary colour map.
    cat: ['#012169','#c8102f','#c8102f','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
    KNN: ['#012169','#c8102f','#ccebc5','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd'],
    cat2: ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6',
    '#289520', '#892f99', '#2f9992', '#99662f', '#a31818', '#85a318'],
    col_umh: ['#ffffcc','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
    col_hscaa: ['#FFFFFF','#a1dab4','#FFFFFF','#FFFFFF','#FFFFFF'],
    col_h: ['#FFFFFF','#FFFFFF','#41b6c4','#FFFFFF','#FFFFFF'],
    col_dca: ['#FFFFFF','#FFFFFF','#FFFFFF','#2c7fb8','#FFFFFF'],
    col_utac: ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#253494'],
  }

  export const map_variable_lookup = {
    'imd': {'geography' : 'bua', 'full_name' : 'IMD', 'avg': 0.5, 'scale': [0, 200, 400, 600, 800, 1000], 'scale_string': [0, 200, 400, 600, 800, 1000], 'scale_colours': colors.seq_5},
    'gva': {'geography' : 'bua', 'full_name' : 'gva', 'avg': 450, 'scale': [0, 200, 400, 600, 800, 1000], 'scale_string': [0, 200, 400, 600, 800, 1000], 'scale_colours': colors.seq_5},
    'GVA': {'geography' : 'bua', 'full_name' : 'gva', 'avg': 450, 'scale': [0, 200, 400, 600, 800, 1000], 'scale_string': [0, 200, 400, 600, 800, 1000], 'scale_colours': colors.seq_5},
    'KNN': {'geography' : 'bua', 'full_name' : 'K Nearest Neighbours', 'avg': 450, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5], 'scale_string': ['Blackpool','1st','2nd','3rd','4th','5th','6th','7th','8th','9th'], 'scale_colours': colors.KNN},
    'classification': {'geography' : 'bua', 'full_name' : 'gva', 'avg': 450, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Minor', 'Small', 'Medium', 'Large', 'Major'], 'scale_colours': colors.seq_5},
    'cluster': {'geography' : 'lad', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster': {'geography' : 'bua', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster2_umh': {'geography' : 'bua_umh', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster2_hscaa': {'geography' : 'bua', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster2_h': {'geography' : 'bua', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster2_dca': {'geography' : 'bua', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'cluster2_utac': {'geography' : 'bua', 'full_name' : 'Model 1 Cluster', 'avg': 100, 'scale': [-0.5,0.5,1.5,2.5,3.5,4.5], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    }

    export const units = {
      'imd': ' rank',
      'gva': ' £',
      'GVA': ' £',
      'KNN': ' nearest neighbour',
      'cluster1': '',
      'cluster2': '',
      'cluster3': '',
    };
    

  export const  mapbounds = {
    uk: [
      [-9, 49 ],
      [ 2, 61 ]
    ],
    england:[
      [-6, 49 ],
      [ 2, 56 ]
    ],
    teesside:[ //For info, we found this bounding box by printing it to the console.log() -- more elegant methods are available.
      [-2.3554797697697483, 54.45116956940452], 
      [-0.7886222700970285, 54.91869752925054]
    ],
    blackpool:[ //For info, we found this bounding box by printing it to the console.log() -- more elegant methods are available.
      [-3.80, 53.56], 
      [-2.23, 54.03]
    ]
  };