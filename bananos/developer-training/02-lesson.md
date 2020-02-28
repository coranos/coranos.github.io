# Lesson Two, gh-pages

## 2.1 - Set up local email address and username
run these commands in Git Bash:

```
git config --global user.email "your_email@example.com"
git config --global user.name "your name"
```

## 2.2 - Create a Github Pages site https://pages.github.com/

```
Create a repository
Head over to GitHub and create a new repository named username.github.io, where username is your username (or organization name) on GitHub.
If the first part of the repository doesn’t exactly match your username, it won’t work, so make sure to get it right.
```

## 2.3 - clone the Github Pages repository to your local computer. This may require creating a Personal Access Token (see step 2.3.1)

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

## 2.3.1 - Create a personal access token.
```
    Go to https://github.com/settings/tokens  
    click 'generate new token'. 
    type gh-pages in the token description.
    select the repo checkbox.
    github will generate a new token. 
    use this token as your password when you push to github. 
```

## 2.4 -  add a file called index.html to the root of the repository.
```
file->add project folder
file->new file
file->save
put the name as "index.html"
```


## 2.5 - Edit the github pages site in atom, locally add your discord id to the top.

```
packages->github->toggle git tab
if you end up having to use git bash instead of atom, you should look at VI commands, as VI is the default editor for git commit:  
http://rcsg-gsir.imsb-dsgi.nrc-cnrc.gc.ca/documents/basic/node168.html  

or supploy a message on the command line:
git commit -a -m "added index.html"
```
