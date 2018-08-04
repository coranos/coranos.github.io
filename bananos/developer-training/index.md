# Developer Training

## Students

| Number | Discord Id    | Progress               | Ghpages Index          |
|:------ |:------------- |:---------------------- |:---------------------- |
| 00     |               | Completed Lesson       |                        |
| 01     | Coranos#4281  | Completed Lesson Four  |[coranos.github.io]     |
| 02     | Mayrapina#9547| Completed Lesson Two   |[mayrapina007.github.io]|
| 69     | not_idol#3950 | Completed Lesson Four  |[not-idol.github.io]    |
| 04     | Lee#2040      | Completed Lesson Two   |[acidlee.github.io]     |
| 05     | Parvu#7388    | Completed Lesson Three |[parvulitum.github.io]  |
| 06     | Monachita#2427| Completed Lesson Four |[lanegrologia1.github.io]   |
| 07     | Trigger Haven#5767| Completed Lesson  |   |
| 08     | Scarlet Alejandra#4565| completed lesson one |



[coranos.github.io]: https://coranos.github.io/
[mayrapina007.github.io]: https://mayrapina007.github.io/
[not-idol.github.io]: https://not-idol.github.io/
[acidlee.github.io]: https://not-idol.github.io/
[parvulitum.github.io]: https://Parvulitum.github.io/
[lanegrologia1.github.io]: https://lanegrologia1.github.io/
## Lesson One, Github and Atom.

1.1) Go to https://github.com and create an account.

*You must enter the aforementioned link, place your data, register and then verify your email to have your account 100% active

1.2) Go to https://git-scm.com/downloads and download git.

*Enter the download link, proceed to download it and install the GIT on your computer.

1.3) Go to https://atom.io/ and download atom (it is a editor).

*For atom we will perform the same discharge procedure as the GIT

1.4) clone https://github.com/coranos/coranos.github.io to your local computer.

*To clone a github we will open our GIT after having installed it and it will give us 3 options CREATE NEW REPOSITORY, CLONE EXISTING REPOSITORY AND OPEN EXISTING REPOSITORY, as it is the first time that we will go to where it says clone existing repository and we will place the address of the github that we want to clone and the address where the cloning process will be saved

*If you are unsure of how to do this, here are the commands to use in *git bash*:
```
cd;
pwd;
mkdir git;
cd git;
git clone https://github.com/coranos/coranos.github.io.git;
cd coranos.github.io;
```

1.5) Using the Github Web Page, add your Discord ID to the Student  list.

## Lesson Two, gh-pages.

2.1) Set up local email address and username
run these commands in Git Bash:

```
git config --global user.email "your_email@example.com"
git config --global user.name "your name"
```

2.2) Create a Github Pages site https://pages.github.com/

```
Create a repository
Head over to GitHub and create a new repository named username.github.io, where username is your username (or organization name) on GitHub.
If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.
```

2.3) clone the Github Pages repository to your local computer. This may require creating a Personal Access Token (see step 2.3.1)

in git bash, in ~/.:

```
mkdir git;
cd git;
git clone https://github.com/<username>/<username>.github.io.git;
cd <username>.github.io;
echo "# <username>.github.io" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin master

```

2.3.1) Create a personal access token.
```
    Go to https://github.com/settings/tokens  
    click 'generate new token'. 
    type gh-pages in the token description.
    select the repo checkbox.
    github will generate a new token. 
    use this token as your password when you push to github. 
```

2.4) add a file called index.html to the root of the repository.
```
file->add project folder
file->new file
file->save
put the name as "index.html"
```


2.5) Edit the github pages site in atom, locally add your discord id to the top.

```
packages->github->toggle git tab
if you end up having to use git bash instead of atom, you should look at VI commands, as VI is the default editor for git commit:  
http://rcsg-gsir.imsb-dsgi.nrc-cnrc.gc.ca/documents/basic/node168.html  

or supploy a message on the command line:
git commit -a -m "added index.html"
```


## Lesson Three, simple index.html.

3.1) in your github pages site, add an index.html with the following code:
```
    <!DOCTYPE html>
    <html>
    <meta charset="utf-8" />
    <head>
    <title>Banano</title>
    </head>
    <body onload="onLoad();">
      <div id="banano"></div>
      <script>
          function onLoad () {
            document.getElementById('banano').innerHTML = 'Coranos Bananos';
          }
        </script>
    </body>
    </html>
```
3.2) update this page with a link to your Github Pages
```
git pull;git commit -a -m "updated index.html";git push;
```

## Lesson Four, add HTML to your index.html, use CSS.

4.1) using atom, in your github pages site, add a file called index.css that contains the following code:

```
.small_image {
  height: 100px;
  width: 100px;
}
```

4.2) in your github pages site, add an ordered list of images. set the image's width and height to be 100 pixels using CSS classes.
```
<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<head>
<title>Banano</title>
<link rel="stylesheet" type="text/css" href="index.css">
</head>
<body onload="onLoad();">
  <div id="banano"></div>
  <ol>
    <li><img class="small_image" src="https://cdn.discordapp.com/attachments/416341951416369153/473520270309720064/kinderschoko.jpg" /></li>
  </ol>
  <script>
      function onLoad () {
        document.getElementById('banano').innerHTML = 'Coranos Bananos';
      }
    </script>
</body>
</html>
```

## Lesson Five, tables in index.html.

read up on html here: https://www.w3schools.com/html/default.asp

read up on css here: https://www.w3schools.com/css/default.asp

### eventually
freelancer amazon-turk fiverr wordpress prestashop opencart joomla magento autotrading-crypto-arbitrage-bot

https://github.com/bbedward/Graham_Nano_Tip_Bot/issues/3

https://getbootstrap.com/
