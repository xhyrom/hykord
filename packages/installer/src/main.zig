const std = @import("std");
const C = @import("injector");
const inquirer = @import("inquirer");
const utils = @import("utils");
const Logger = utils.Logger;
const allocator = utils.allocator;
const discord_platform = utils.discord_platform;
const join_path = utils.join_path;
const handle_error = utils.handle_error;

pub fn main() anyerror!void {
    const in = std.io.getStdIn().reader();
    const out = std.io.getStdOut().writer();

    const platform = inquirer.forEnum(out, in, "Please, select discord platform.", allocator, discord_platform, discord_platform.stable) catch unreachable;
    const discord_directory = C.get_app_directory(platform);

    const default_directory = if (C.does_file_exist(C.get_hykord_default_source_folder())) C.get_hykord_default_source_folder() else null;
    const hykord_directory = inquirer.forString(out, in, "Please, write path for hykord", allocator, default_directory) catch unreachable;
    const hykord_source_directory = join_path(&.{ hykord_directory, "install" });

    std.fs.makeDirAbsolute(hykord_directory) catch |err| {
        handle_error(err, true);
    };

    std.fs.makeDirAbsolute(hykord_source_directory) catch |err| {
        handle_error(err, true);
    };

    std.debug.print("test {s} {s} {s}", .{ @tagName(platform), discord_directory, hykord_source_directory });

    // mus tdownload fiiiiiiiiiiiiiiiiiiiiile
    // const argv = &[_][]const u8{ "bash", "-c", "'curl -s https://api.github.com/repos/jgm/pandoc/releases/latest | grep 'browser_download_url.*deb''" };
    // const child = try std.ChildProcess.init(argv, allocator);
    // defer child.deinit();

    // // Configure child process stdio behavior.
    // child.stdin_behavior = .Close; // close so it doesn't block on stdin
    // child.stdout_behavior = .Inherit; // pipe to /dev/null
    // child.stderr_behavior = .Ignore; // pipe to /dev/null

    // // Run the command and handle its exit status.
    // _ = try child.spawnAndWait();
    // //std.debug.print("test {any}\n", .{status});

    // std.debug.print("test {s} {s} {s}", .{@tagName(platform), discord_directory, hykord_source_directory});
}
