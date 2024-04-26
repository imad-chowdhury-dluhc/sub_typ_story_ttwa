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
    seq_4: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8'],
    seq_5: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'],
    seq_tr_20: ['rgba(255,255,204,0.3)','rgba(161,218,180,0.3)','rgba(65,182,196,0.3)','rgba(44,127,184,0.3)','rgba(37,52,148,0.3)'],
    seq_tr: ['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)','rgba(0, 0, 0, 0)'],
    seq_5_r: ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'].reverse(),
    seq_tr_20_r: ['rgba(255,255,204,0.3)','rgba(161,218,180,0.3)','rgba(65,182,196,0.3)','rgba(44,127,184,0.3)','rgba(37,52,148,0.3)'].reverse(),
    seq_2: ['#ffffbf', '#d7191c'], //A binary colour map.
    cat: ['#012169','#c8102f','#c8102f','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
    cat2: ['#206095', '#A8BD3A', '#003C57', '#27A0CC', '#118C7B', '#F66068', '#746CB1', '#22D0B6',
    '#289520', '#892f99', '#2f9992', '#99662f', '#a31818', '#85a318']
  }

  export const map_variable_lookup = {
    'rank': {'geography' : 'lad', 'full_name' : 'Rank', 'avg': 0.5, 'scale': [0, 0.2, 0.4, 0.6, 0.8, 1], 'scale_string': [0, 0.2, 0.4, 0.6, 0.8, 1], 'scale_colours': colors.seq_5},
    'gva': {'geography' : 'bua', 'full_name' : 'GVA', 'avg': 450, 'scale': [0, 200, 400, 600, 800, 1000], 'scale_string': [0, 200, 400, 600, 800, 1000], 'scale_colours': colors.seq_5},
    'imd': {'geography' : 'bua', 'full_name' : 'IMD', 'avg': 0.5, 'scale': [0, 200, 400, 600, 800, 1000], 'scale_string': [0, 200, 400, 600, 800, 1000], 'scale_colours': colors.seq_5},
    'cluster': {'geography' : 'bua', 'full_name' : 'Cluster', 'avg': 5, 'scale': [0,1,2,3,4], 'scale_string': ['Urban Multicultural hubs', 'High Skilled City adjacent areas', 'Hinterlands', 'Deprived coastal areas', 'University towns and cities'], 'scale_colours': colors.seq_5},
    'GVA': {'geography' : 'lad', 'full_name' : 'GVA', 'avg': 35.57, 'scale': [23.130, 29.828, 32.324, 35.504, 39.498, 73.950], 'scale_string': ["23 - 30 (thousand)", "30 - 32", "32 - 35", "35 - 39", "39 - 75"], 'scale_colours': colors.seq_5},
    'workplace_pop': {'geography' : 'lsoa', 'full_name' : 'Workplace population', 'avg': 760, 'scale': [54, 163, 238, 354, 672, 16175], 'scale_string': ["50 -160", "160 - 240", "240 - 350", "350 - 670", "670 - 16200"], 'scale_colours': colors.seq_5},
    'GVA_LSOA': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_5},
    'GVA2020': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_5},
    'GVA2020_faint': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_tr_20},
    'GVA2015': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_5},
    'GVA2010': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_5},
    'GVA2005': {'geography' : 'lsoa', 'full_name' : 'GVA', 'avg': 50.34, 'scale': [0.22, 4.76, 7.23, 11.31, 25.09, 911.67], 'scale_string': ["0 - 4", "4 - 7", "7 - 11", "11 - 25", "25 - 950"], 'scale_colours': colors.seq_5},
    'lat': {'geography' : 'lad', 'full_name' : 'Latitude', 'avg': 0.5, 'scale': [-0.5, 0.5,1.5], 'scale_string': ["N", "Y"], 'scale_colours': colors.seq_2}
    }

    export const units = {
      'gva': ' £',
      'imd': ' rank',
      'rank': '',
      'cluster': '',
      'GVA': '£/jozb filled',
      'GVA2020': 'million',
      'GVA2015': 'million',
      'GVA2010': 'million',
      'GVA2005': 'million',
      'GVA2020_faint': 'million',
      'workplace_pop': 'people',
      'latitude': ''
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
    ]
  };