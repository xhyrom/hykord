mod args;

fn main() {
    let args = args::parse();

    println!("{:?}", args);

    match args.action {
        args::Action::install => {
            println!("Installing...");
        }
        args::Action::uninstall => {
            println!("Uninstalling...");
        }
        args::Action::inject => {
            println!("Injecting...");
        }
        args::Action::uninject => {
            println!("Uninjecting...");
        }
        args::Action::repair => {
            println!("Repairing...");
        }
    }
}