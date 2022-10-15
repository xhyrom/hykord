use home::home_dir;
use std::path::Path;
use std::fs;

use crate::args::ReleaseChannel;

fn get_homedir() -> String {
    match home_dir() {
        Some(path) => path.to_str().unwrap().to_string(),
        None => "".to_string(),
    }
}

#[cfg(target_os = "windows")]
fn get_local_appdata() -> String {
    let mut path = get_homedir();
    path.push_str(r"\AppData\Local");
    path
}

#[cfg(target_os = "windows")]
pub fn get_discord_resources(directory: &String) -> Option<String> {
    let path = Path::new(directory);
    let mut known: Option<String> = None;

    for entry in path.read_dir().unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();

        if path.is_dir() {
            let dir_name = path.file_name().unwrap().to_str().unwrap();

            if dir_name.starts_with("app-") {
                let mut resources = path.to_str().unwrap().to_string();
                resources.push_str(r"\resources\app");
                known = Some(resources);
            }
        }
    }

    return known;
}

#[cfg(target_os = "linux")]
pub fn get_discord_resources(directory: &String) -> Option<String> {
    let mut directory = directory.to_string();
    directory.push_str(r"/resources/app");

    return Some(directory);
}

pub fn find_discord(release_channel: &ReleaseChannel) -> Option<String> {
    #[cfg(target_os = "linux")]
    let discord: [[&str; 5]; 4] = [
        [
            "/usr/share/discord",
            "/usr/lib64/discord",
            "/opt/discord",
            "/opt/Discord",
            &(get_homedir() + "/.local/bin/Discord")
        ],
        [
            "/usr/share/discord-ptb",
            "/usr/lib64/discord-ptb",
            "/opt/discord-ptb",
            "/opt/DiscordPTB",
            &(get_homedir() + "/.local/bin/DiscordPTB")
        ],
        [
            "/usr/share/discord-canary",
            "/usr/lib64/discord-canary",
            "/opt/discord-canary",
            "/opt/DiscordCanary",
            &(get_homedir() + "/.local/bin/DiscordCanary")
        ],
        [
            "/usr/share/discord-development",
            "/usr/lib64/discord-development",
            "/opt/discord-development",
            "/opt/DiscordDevelopment",
            &(get_homedir() + "/.local/bin/DiscordDevelopment")
        ]
    ];
    #[cfg(target_os = "windows")]
    let discord: [[&str; 1]; 4] = [
        [
            &(get_local_appdata() + r"\Discord") 
        ],
        [&(get_local_appdata() + r"\DiscordPTB")],
        [&(get_local_appdata() + r"\DiscordCanary")],
        [&(get_local_appdata() + r"\DiscordDevelopment")]
    ];

    match release_channel {
        ReleaseChannel::stable => {
            for path in discord[0].iter() {
                if Path::new(path).exists() {
                    return Some(path.to_string());
                }
            }
        }
        ReleaseChannel::ptb => {
            for path in discord[1].iter() {
                if Path::new(path).exists() {
                    return Some(path.to_string());
                }
            }
        }
        ReleaseChannel::canary => {
            for path in discord[2].iter() {
                if Path::new(path).exists() {
                    return Some(path.to_string());
                }
            }
        }
        ReleaseChannel::dev => {
            for path in discord[3].iter() {
                if Path::new(path).exists() {
                    return Some(path.to_string());
                }
            }
        }
    }

    return None;
}

pub fn inject(discord_path: &String, hykord_path: &String) {
    let discord_path = Path::new(discord_path);
    let hykord_path = Path::new(hykord_path);

    match fs::create_dir(&discord_path) {
        Ok(_) => println!("Created app directory"),
        Err(e) => println!("Error: {}", e),
    };

    match fs::write(
        &discord_path.join("index.js"),
        format!(
            "require(\"{}\");\nrequire(\"../app.asar\");",
            hykord_path.join("main.js").to_str().unwrap().replace(r"\", r"\\")
        )
    ) {
        Ok(_) => println!("Created app/index.js file"),
        Err(e) => println!("Error: {}", e),
    };

    match fs::write(
        &discord_path.join("package.json"),
        "{\"name\": \"discord\", \"main\": \"index.js\"}"
    ) {
        Ok(_) => println!("Created app/package.json file"),
        Err(e) => println!("Error: {}", e),
    };
}