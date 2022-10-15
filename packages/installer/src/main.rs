use args::ReleaseChannel;
use std::path::Path;

mod args;
mod discord;
mod github;

fn main() {
    let args = args::parse();

    let release_channel = args.release_channel.unwrap_or(ReleaseChannel::stable);
    let discord: Option<String>;
    if !args.discord_path.is_none() {
        discord = args.discord_path;
    } else {
        discord = discord::find_discord(&release_channel);
    }

    if discord.is_none() {
        println!("Could not find Discord");
        return;
    }

    let discord = discord.unwrap();
    if !Path::new(&discord).exists() {
        println!("Invalid Discord path {}", discord);
        return;
    }

    let resources = discord::get_discord_resources(&discord);
    if resources.is_none() {
        println!("Could not find Discord resources");
        return;
    }

    let resources = resources.unwrap();
    let hykord_path = args.hykord_path.unwrap_or(".".to_string());

    match args.action {
        args::Action::install => {
            println!("Downloading Hykord from github releases...");
            if !github::download_release(&hykord_path) {
                println!("Could not download Hykord");
                return;
            };

            println!("Injecting hykord into {:?}", &release_channel);
            discord::inject(&resources, &hykord_path);
            println!("Successfully injected!");
        }
        args::Action::uninstall => {
            println!("Uninstalling... {}", discord);
        }
        args::Action::inject => {
            println!("Injecting hykord into {:?}", &release_channel);
            discord::inject(&resources, &hykord_path);
            println!("Successfully injected!");
        }
        args::Action::uninject => {
            println!("Uninjecting... {}", discord);
        }
        args::Action::repair => {
            println!("Repairing... {}", discord);
        }
    }
}