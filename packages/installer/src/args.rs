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

#[allow(non_camel_case_types)]
#[derive(clap::ValueEnum, Clone, Debug)]
pub enum ReleaseChannel {
    stable,
    ptb,
    canary,
    dev
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
        long,
        required=false
    )]
    pub hykord_path: Option<String>,

    #[arg(
        long,
        required=false
    )]
    pub discord_path: Option<String>,

    #[arg(
        short, long,
        required=false
    )]
    pub release_channel: Option<ReleaseChannel>,
}

pub fn parse() -> Args {
    let args = Args::parse();
    return args;
}