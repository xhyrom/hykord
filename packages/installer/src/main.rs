use args::ReleaseChannel;
use std::path::Path;

mod args;
mod discord;

fn main() {
    let args = args::parse();

    let discord: Option<String>;
    if !args.discord_path.is_none() {
        discord = args.discord_path;
    } else {
        discord = discord::find_discord(args.release_channel.unwrap_or(ReleaseChannel::stable));
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

    match args.action {
        args::Action::install => {
            println!("Installing... {} | {}", &discord, resources);
        }
        args::Action::uninstall => {
            println!("Uninstalling... {}", discord);
        }
        args::Action::inject => {
            println!("Injecting... {}", discord);
        }
        args::Action::uninject => {
            println!("Uninjecting... {}", discord);
        }
        args::Action::repair => {
            println!("Repairing... {}", discord);
        }
    }
}