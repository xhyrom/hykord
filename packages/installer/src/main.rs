mod args;
mod find;

fn main() {
    let args = args::parse();
    let discord = find::find_discord();

    if discord.is_none() {
        println!("Could not find Discord");
        return;
    }

    let discord = discord.unwrap();

    match args.action {
        args::Action::install => {
            println!("Installing... {}", discord);
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