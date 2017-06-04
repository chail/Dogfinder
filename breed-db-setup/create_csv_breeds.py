import urllib2
from bs4 import BeautifulSoup

main_page = "http://dogtime.com/dog-breeds/groups/";

# get main webpage
url = urllib2.urlopen(main_page)
main_content = url.read()
main_soup = BeautifulSoup(main_content, "html.parser")

# get group webpages
group_list = main_soup.find("ul", {'class', 'posts-list'})

# get groups
groups = group_list.findAll("a", href = True)

# open output csv
fout = open("breed_info.csv", 'w')

# write label row to csv
fout.write('breed');
fout.write(',');
fout.write('Adaptability');
fout.write(',');
fout.write('Friendliness');
fout.write(',');
fout.write('Grooming');
fout.write(',');
fout.write('Trainability');
fout.write(',');
fout.write('ActivityLevel');
fout.write(',');
fout.write('GoodForApartment');
fout.write(',');
fout.write('GoodForNoviceOwner');
fout.write(',');
fout.write('Sensitivity');
fout.write(',');
fout.write('ToleratesBeingAlone');
fout.write(',');
fout.write('ToleratesCold');
fout.write(',');
fout.write('ToleratesHot');
fout.write(',');
fout.write('LikesFamily');
fout.write(',');
fout.write('LikesKids');
fout.write(',');
fout.write('LikesDogs');
fout.write(',');
fout.write('LikesStrangers');
fout.write(',');
fout.write('Sheds');
fout.write(',');
fout.write('Drools');
fout.write(',');
fout.write('EasyToGroom');
fout.write(',');
fout.write('Healthy');
fout.write(',');
fout.write('PotentialForWeightGain');
fout.write(',');
fout.write('Size');
fout.write(',');
fout.write('EasyToTrain');
fout.write(',');
fout.write('Intelligent');
fout.write(',');
fout.write('LikesFetch');
fout.write(',');
fout.write('PreyDrive');
fout.write(',');
fout.write('Barks');
fout.write(',');
fout.write('Wanders');
fout.write(',');
fout.write('EnergyLevel');
fout.write(',');
fout.write('ExerciseIntensity');
fout.write(',');
fout.write('ExerciseNeeds');
fout.write(',');
fout.write('Playfulness');
fout.write('\n');


# for each group, get dogs in group
for group in groups:
    
    group_name_tag = group.find('p')
    if group_name_tag != None:
        # get group name from current page
        group_name = group_name_tag.string

        # open link to group
        group_page = group['href']
        group_url = urllib2.urlopen(group_page)
        group_content = group_url.read()
        group_soup = BeautifulSoup(group_content, "html.parser")
        breed_list = group_soup.find('article')
        breeds = breed_list.findAll('a', {'class', "column-link"})
        for breed in breeds:
            breed_page = breed['href']
            breed_name = breed.find('span',  {'class', "post-title"}).string
            breed_url = urllib2.urlopen(breed_page)
            breed_content = breed_url.read()
            breed_soup = BeautifulSoup(breed_content,"html.parser")
            
            # write breed name and type
            fout.write(breed_name)
            fout.write(',')
            
            major_traits = breed_soup.findAll('div', {'class',"star-by-breed clearfix default-border-bottom default-margin-bottom default-padding-bottom parent-characteristic"})
            for trait in major_traits:
                trait_name = trait.find('span',  {'class', "characteristic item-trigger-title"}).string
                trait_stars_tag = trait.find('span', {'class',"star-block stars-column"}).find(['span','span'])
                trait_stars = trait_stars_tag['class'][-1][-1]
                fout.write(trait_stars)
                fout.write(',')
            
            minor_traits = breed_soup.findAll('div', {'class',"js-list-item item-expandable-content default-border-bottom default-margin-bottom default-padding-bottom star-by-breed child-characteristic"})    
            for trait in minor_traits:
                trait_name = trait.find('span', {'class', "characteristic item-trigger-title"}).string
                trait_stars = trait.find('span', {'class',"star-block stars-column"}).find(['span','span']).string
                fout.write(trait_stars)
                fout.write(',')
            
            fout.write("\n")
            

fout.close();        
                