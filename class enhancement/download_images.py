import pandas as pd
import urllib, json, requests, os

"""
Created by Wen on Mar 19, 2018
"""

df = pd.read_csv('full.csv', encoding='latin')
names = df['name']
for name in names:
    query_name = name.replace(" ", "_")
    wiki_image_query = "https://en.wikipedia.org/w/api.php?action=query&titles={}&prop=pageimages&format=json&pithumbsize=100".format(query_name)

    try:
        json_file = requests.get(wiki_image_query).json()
    except:
        print('Failed to open query {}', query_name)

    for elm in json_file['query']['pages']:
        if "thumbnail" in json_file['query']['pages'][elm]:
            url = json_file['query']['pages'][elm]['thumbnail']['source']
            image_file = "images/" + name + ".jpg"
            image = urllib.request.urlretrieve(url, image_file)
        else:
            print("No image for {}", query_name)
