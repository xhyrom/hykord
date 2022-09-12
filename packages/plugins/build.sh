plugins=("plugin-zone" "custom-volume-range")

if [ -d dist ]; then
    rm -rf dist/
fi

mkdir dist

for plugin in "${plugins[@]}"
do
    cd "./$plugin"
    bun install
    bun run build
    cd "../"
    mkdir "dist/plugin-$plugin"
    cp -r "./$plugin/dist" "dist/plugin-$plugin/dist"
    zip -r "dist/plugin-$plugin.zip" "./$plugin/dist"

    if [[ $DEV == true ]]; then
        mkdir "$HOME/.hykord/canary/plugins/$plugin"
        rsync -rv --exclude=node_modules "./$plugin/dist" "$HOME/.hykord/canary/plugins/$plugin"
    fi
done