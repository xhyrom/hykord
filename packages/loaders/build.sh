loaders=("powercord-and-replugged")

mkdir dist

for loader in ${loaders[@]}; do
    zip -r "dist/loader-$loader.zip" "./$loader"
done