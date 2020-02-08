#!/usr/bin/python3
import json
from collections import defaultdict


with open("../positive_words_es.txt") as pos:
    pos_words = pos.read().split('\n')
    pos_words  = pos_words[:-1]

with open("../negative_words_es.txt") as neg:
    neg_words = neg.read().split('\n')
    neg_words  = neg_words[:-1]

pos = defaultdict(lambda : [])
neg = defaultdict(lambda : [])

for word in pos_words:
    pos[len(word)].append(word)

for word in neg_words:
    neg[len(word)].append(word)

with open('../pos_words.js','w') as export:
    data = json.dumps(pos)
    export.write("const POS_WORDS = "+data)

with open('../neg_words.js','w') as export:
    data = json.dumps(pos)
    export.write("const NEG_WORDS = "+data)
