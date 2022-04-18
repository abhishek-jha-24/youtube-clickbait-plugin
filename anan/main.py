from flask import Flask, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
filename = 'finalized_model.sav'
import pickle
from googleapiclient.discovery import build
import re
api_key = "AIzaSyAS0PRJNwRPoH2xYBroM0d-8PBHAm0ApB4"
from html import unescape


loaded_model = pickle.load(open(filename, 'rb'))
app = Flask(__name__)
api = Api(app)
CORS(app)

name = 1

punc = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''


def dotheWork(vid):

  def only_neg_words(word):
      return word

  def remove_punc(test_str):
    test_str=str(test_str)
    for ele in test_str:
      if ele in punc:
        test_str = test_str.replace(ele, "")
    return test_str

  def remove_URL(sample):
      """Remove URLs from a sample string"""
      return re.sub(r"http\S+", "", sample)


  def video_comments(url):
      formed=[]
      # empty list for storing reply

      # creating youtube resource object
      youtube = build('youtube', 'v3',
                      developerKey=api_key)

      # retrieve youtube video results
      video_response=youtube.commentThreads().list(
      part='snippet,replies',
      videoId=url
      ).execute()

      # iterate video response    
          # extracting required info
          # from each result object 
      while video_response:
          for item in video_response['items']:
              # Extracting comments
              comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
              counter=item['snippet']['topLevelComment']['snippet']['likeCount']
              # counting number of reply of comment
              replycount = item['snippet']['totalReplyCount']
              # if reply is there
             
              comment = remove_URL(comment)
              # print comment with list of reply
              comment = (unescape(comment)).replace("<br>", " ")
              comment = comment.replace("\n", " ")
              comment = comment.replace(",", " ")
              comment = comment.replace("'", " ")
              comment = comment.replace("@", " ")
              comment = comment.replace("<b>", " ")
              comment = comment.replace("\r", " ")
              comment = comment.replace("</b>", " ")
              comment = comment.replace('<a href="', " ")
              comment = comment.replace('</a>', " ")
              comment = re.sub(' +', ' ', comment)
              try:
                  temp=remove_punc(comment)
                  ans=only_neg_words(temp)
                  if len(ans) > 0:
                      formed.append([counter, ans])
              except Exception as e:
                  print("Inner exception", e)
              

          if 'nextPageToken' in video_response:
              video_response = youtube.commentThreads().list(
              part = 'snippet',
              videoId = url,
              pageToken = video_response['nextPageToken']
              ).execute()
          else:
              break 
      
      formed.sort(reverse=True)
      return formed
  # Enter video id
  now = []
  try:
      formed = video_comments(vid)
      for i in range(0, min(len(formed), 100)):
        now.append(str(formed[i][1]))
  except Exception as e:
      now = []
      print(e)
      pass
  last = ' '.join(now)
  return last  

class status (Resource):
    def get(self):
        try:
            return {'data': 'Api is Running'}
        except:
            return {'data': 'An Error Occurred during fetching Api'}

class getRating(Resource):
  def get(self, a):
    print("video id:", a)
    now = dotheWork(a)

    if now == "":
    	return 0
    y = [now]
    ok = loaded_model.predict_proba(y)
    return ok[0][1]


api.add_resource(status, '/')
api.add_resource(getRating, '/getRating/<string:a>')


if __name__ == '__main__':
    app.run()
    