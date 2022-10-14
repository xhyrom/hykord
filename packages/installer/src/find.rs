use home::home_dir;
use std::path::Path;

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

pub fn find_discord(release_channel: ReleaseChannel) -> Option<String> {
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