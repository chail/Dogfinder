import re
import os

# scrape the 1000 most populous zip codes from zip-data folder
# taken from: http://zipatlas.com/us/zip-code-comparison/population-density.htm

if __name__ == "__main__":
    regex = r'zip-[0-9]{5}.htm'
    with open('zipcodelist.txt', 'w') as f1:
        files = os.listdir('./zip-data')
        for zipfile in files:
            with open(os.path.join('./zip-data', zipfile), 'r') as f2:
                for line in f2:
                    zips = [x[4:9] for x in re.findall(regex, line)]
                    [f1.write('{}\n'.format(x)) for x in zips]
            f2.close()
    f1.close()
