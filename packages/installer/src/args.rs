use clap::Parser;

#[allow(non_camel_case_types)]
#[derive(clap::ValueEnum, Clone, Debug)]
pub enum Action {
    install,
    uninstall,
    inject,
    uninject,
    repair
}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    // Action
    #[clap(
        value_enum,
        required=true
    )]
    pub action: Action,

    #[arg(
        required=false
    )]
    pub hykord_path: Option<String>,

    #[arg(
        required=false
    )]
    pub discord_path: Option<String>,
}

pub fn parse() -> Args {
    let args = Args::parse();
    return args;
}