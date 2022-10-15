use serde::{Deserialize};
use std::path::Path;

#[derive(Deserialize)]
struct Asset {
    name: String,
    browser_download_url: String,
}

#[derive(Deserialize)]
struct Release {
    assets: Vec<Asset>,
}

pub fn download_release(hykord_path: &String) -> bool {
    let client = reqwest::blocking::Client::new();
    let response = client
        .get("https://api.github.com/repos/xHyroM/hykord/releases/latest")
        .header("User-Agent", "Hykord Installer")
        .send()
        .unwrap();

    if !response.status().is_success() {
        return false;
    }

    let body: Release = response.json().unwrap();

    for asset in body.assets {
        let response = client
            .get(&asset.browser_download_url)
            .header("User-Agent", "Hykord Installer")
            .send()
            .unwrap();

        if !response.status().is_success() {
            return false;
        }

        let path = Path::new(hykord_path).join(asset.name);
        if !path.parent().unwrap().exists() {
            std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        }

        let mut file = std::fs::File::create(path).unwrap();
        std::io::copy(&mut response.text().unwrap().as_bytes(), &mut file).unwrap();
    }

    return true;
}