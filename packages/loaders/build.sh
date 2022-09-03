loaders=("powercord-and-replugged")

[ ! -d "dist" ] && mkdir dist

for loader in ${loaders[@]}; do
    zip -r "dist/loader-$loader.zip" "./$loader"
done