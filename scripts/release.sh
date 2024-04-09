#!/bin/bash

# Make sure not have any commit change in current branch.
if [[ -n $(git status --porcelain) ]]; then
  echo "Your working directory is not clean. Please commit or stash your changes before starting the release process."
  exit 1
fi

# Ensure you are on the develop branch
git checkout develop

# Make sure the develop branch is up-to-date
git pull origin develop

# Fetch all tags
git fetch --tags

# Check version.txt exist
if [[ ! -f version.txt ]]; then
  echo "0.0.0" > version.txt
  git add version.txt
  git commit -m "Bump first version to 0.0.0"
  git push origin develop:develop
  echo "Error!!!: version.txt file not found."
  exit 1
fi

# Get the latest tag
latest_tag=$(cat version.txt)

echo "************************************"
echo "****** git tag latest: $latest_tag ******"
echo "************************************"

# Enter the release version
echo "Enter the release version (e.g. 1.0.0): "
read version

# Check if the version is a valid number
if ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid release version. Please enter a valid version number (e.g., 1.0.0)."
  exit 1
fi

# Compare the versions
if [[ "$version" == "$latest_tag" || "$version" < "$latest_tag" ]]; then
  echo "The release version cannot be less than or equal to the current version ($latest_tag). Please try again."
  exit 1
fi

# Create a release branch
git checkout -b release/$version

# Update the version number in the file (if any) and commit
# Example: update version.txt, replace "version.txt" with the name of your file containing version information
echo $version > version.txt
git add version.txt
git commit -m "Bump version to $version"

# Merge release branch into main
git checkout main
git merge release/$version --no-ff -m "Merge release $version into main"

# Merge release branch into develop
git checkout develop
git merge main --no-ff

# Tag the release
git tag "v$version"

# Push the changes to the remote repository, including main, develop branches, and tags
git push origin "v$version"
git push origin main:main
git push origin develop:develop

# Delete the local release branch
git branch -d release/$version
git checkout develop

# Optionally, delete the remote release branch
# git push origin --delete release/$version

echo ""
echo ""
echo ""
echo "Everything is fine, Now you can release the dragon......"
echo ""
echo ""
echo ""

open https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2
