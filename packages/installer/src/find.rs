use home::home_dir;

fn get_homedir() -> String {
    match home_dir() {
        Some(path) => path.to_str().unwrap().to_string(),
        None => "".to_string(),
    }
}

pub fn find_discord() -> Option<String> {
    #[cfg(target_os = "linux")]
    let discord: [&str; 5] = ["/usr/share/discord", "/usr/lib64/discord", "/opt/discord", "/opt/Discord", &(get_homedir() + "/.local/bin/Discord")];

    for ele in discord {
        if std::path::Path::new(ele).exists() {
            return Some(ele.to_string());
        }
    }

    return None;
}