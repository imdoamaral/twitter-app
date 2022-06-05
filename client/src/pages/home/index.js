import React, { useState, useEffect } from "react";
import axios from "axios";

import TweetForm from "../../components/tweet-form";
import TweetList from "../../components/tweet-list";
import Layout from "../../components/layout";

export default function Home() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const token = localStorage.getItem("SESSION_TOKEN");


        const tweetResponse = await axios.get("http://localhost:3333/tweets",
          {
            headers: { "auth-token": token }
          }
        );

        const tweetUsers = await Promise.all(
          tweetResponse.data.map(async tweet => {
            const user = await axios.get("http://localhost:3333/users/{tweet.owner}",
              {
                headers: { "auth-token": token }
              }
            );

            return { ...tweet, username: user.data.username };
          })
        );

        setTweets(tweetUsers);
      } catch (error) {
        console.error(error);
      }

    };

    fetchTweets();
  }, []);

  const handleLike = (ownerID, tweetID) => {
    console.log(ownerID, tweetID);

    const newTweets = tweets.map(tweet => {
      if (tweet._id === tweetID) {
        const tweetLiked = tweet.likes.find(owner => owner === ownerID);

        if (tweetLiked) {
          return {
            ...tweet,
            likes: tweet.likes.filter(owner => owner !== ownerID)
          };
        }
        return { ...tweet, likes: [...tweet.likes, ownerID] };
      }
      return tweet;
    });

    setTweets(newTweets.reverse());
  };

  const onCreateTweet = async content => {
    try {
      const token = localStorage.getItem("SESSION_TOKEN");

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/tweets`,
        {
          content
        },
        {
          headers: { "auth-token": token }
        }
      );

      setTweets([...tweets, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <TweetForm onCreateTweet={onCreateTweet} />
      <TweetList tweets={tweets} onLike={handleLike} />
    </Layout>
  );
}