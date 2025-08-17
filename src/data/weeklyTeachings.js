const weeklyTeachings = {
  1: {
    ancient: {
      quote: "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant...",
      author: "Marcus Aurelius",
      source: "Meditations 2.1",
      link: "https://www.amazon.com/Meditations-New-Translation-Marcus-Aurelius/dp/0812968255/"
    },
    modern: {
      quote: "The richest place in the world is the cemetery, because it's full of dreams and ideas that were never acted upon due to morning distraction.",
      author: "Cal Newport",
      source: "Deep Work (2016)",
      link: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692/"
    }
  },
  2: {
    ancient: {
      quote: "Wealth consists not in having great possessions, but in having few wants.",
      author: "Epictetus",
      source: "Discourses Book 4",
      link: "https://www.amazon.com/Discourses-Selected-Writings-Penguin-Classics/dp/0140449469/"
    },
    modern: {
      quote: "The opposite of consumption isn't thrift. It's generosity.",
      author: "Raj Patel",
      source: "The Value of Everything (2019)",
      link: "https://www.amazon.com/Value-Everything-Making-Taking-Economy/dp/1610398068/"
    }
  },
  3: {
    ancient: {
      quote: "Winter swimming is the king of all exercises.",
      author: "Mao Zedong",
      source: "Historical Practice",
      link: "https://www.amazon.com/Mao-Life-Philip-Short/dp/0805066381/"
    },
    modern: {
      quote: "You begin to take charge of your life and smash your comfort zone by tackling the hardest thing first thing in the morning: a cold shower.",
      author: "Jesse Harless",
      source: "Smash Your Comfort Zone with Cold Showers(2018)",
      link: "https://www.amazon.com/Smash-Your-Comfort-Zone-Showers/dp/0578407892/"
    }
  },
  4: {
    ancient: {
      quote: "The Buddha ate one meal a day for the last 45 years of his life.",
      author: "Buddhist Tradition",
      source: "Vinaya Pitaka",
      link: "https://www.amazon.com/Buddhist-Monastic-Code-Training-Translation/dp/1478395729/"
    },
    modern: {
      quote: "Constraints breed creativity. In food, as in life.",
      author: "Samin Nosrat",
      source: "Salt, Fat, Acid, Heat (2017)",
      link: "https://www.amazon.com/Salt-Fat-Acid-Heat-Mastering/dp/1476753830/"
    }
  },
  5: {
    ancient: {
      quote: "All of humanity's problems stem from man's inability to sit quietly in a room alone.",
      author: "Blaise Pascal",
      source: "Pensées #139",
      link: "https://www.amazon.com/Pensées-Penguin-Classics-Blaise-Pascal/dp/0140446451/"
    },
    modern: {
      quote: "Solitude is not the absence of company, but the moment when our soul is free to speak to us.",
      author: "Paulo Coelho",
      source: "Manuscript Found in Accra (2013)",
      link: "https://www.amazon.com/Manuscript-Found-Accra-Paulo-Coelho/dp/0345805887/"
    }
  },
  6: {
    ancient: {
      quote: "With the setting of the sun, depart from the world's affairs.",
      author: "St. Isaac the Syrian",
      source: "Ascetical Homilies (7th century)",
      link: "https://www.amazon.com/Ascetical-Homilies-Saint-Isaac-Syrian/dp/0913836141/"
    },
    modern: {
      quote: "Light is the most powerful regulator of human physiology and behavior.",
      author: "Dr. Satchin Panda",
      source: "The Circadian Code (2018)",
      link: "https://www.amazon.com/Circadian-Code-Supercharge-Transform-Midnight/dp/163565243X/"
    }
  },
  7: {
    ancient: {
      quote: "Fasting is the first principle of medicine.",
      author: "Rumi",
      source: "Masnavi Book 5",
      link: "https://www.amazon.com/Masnavi-Book-Five-Maulana-Jalalu-d-Din/dp/0192804383/"
    },
    modern: {
      quote: "Nothing has been more powerful in my life than learning how to do nothing - to fast.",
      author: "Dr. Jason Fung",
      source: "The Complete Guide to Fasting (2016)",
      link: "https://www.amazon.com/Complete-Guide-Fasting-Intermittent-Alternate-Day/dp/1628600012/"
    }
  },
  8: {
    ancient: {
      quote: "Leisure without study is death - a tomb for the living person.",
      author: "Seneca",
      source: "Letters to Lucilius, Letter 82",
      link: "https://www.amazon.com/Letters-Stoic-Penguin-Classics/dp/0140442103/"
    },
    modern: {
      quote: "We are amusing ourselves to death.",
      author: "Neil Postman",
      source: "Amusing Ourselves to Death (1985)",
      link: "https://www.amazon.com/Amusing-Ourselves-Death-Discourse-Business/dp/014303653X/"
    }
  },
  9: {
    ancient: {
      quote: "Speak only if it improves upon the silence.",
      author: "Buddha",
      source: "Sutta Nipata",
      link: "https://www.amazon.com/Sutta-Nipata-Translated-Laurence-Khantipalo/dp/1681723352/"
    },
    modern: {
      quote: "The quality of our listening determines the quality of our influence.",
      author: "Susan Scott",
      source: "Fierce Conversations (2002)",
      link: "https://www.amazon.com/Fierce-Conversations-Achieving-Success-Conversation/dp/0425193373/"
    }
  },
  10: {
    ancient: {
      quote: "What is done for another is done for oneself.",
      author: "Paracelsus",
      source: "Collected Works (1493-1541)",
      link: "https://www.amazon.com/Essential-Paracelsus-C-Jung-Foundation/dp/0691029156/"
    },
    modern: {
      quote: "Altruism is not self-sacrifice, but self-fulfillment.",
      author: "Matthieu Ricard",
      source: "Altruism (2015)",
      link: "https://www.amazon.com/Altruism-Power-Compassion-Change-Yourself/dp/0316208248/"
    }
  },
  11: {
    ancient: {
      quote: "In the sweat of your face you shall eat bread.",
      author: "Genesis",
      source: "3:19",
      link: "https://www.amazon.com/Holy-Bible-English-Standard-Version/dp/1433524619/"
    },
    modern: {
      quote: "The body achieves what the mind believes.",
      author: "Carol Dweck",
      source: "Mindset (2006)",
      link: "https://www.amazon.com/Mindset-Psychology-Carol-S-Dweck/dp/0345472322/"
    }
  },
  12: {
    ancient: {
      quote: "The truth will set you free.",
      author: "Jesus",
      source: "John 8:32",
      link: "https://www.amazon.com/Holy-Bible-English-Standard-Version/dp/1433524619/"
    },
    modern: {
      quote: "Honesty is a practice, not a policy.",
      author: "Glennon Doyle",
      source: "Untamed (2020)",
      link: "https://www.amazon.com/Untamed-Glennon-Doyle/dp/1984801252/"
    }
  }
};

export default weeklyTeachings; 