const std = @import("std");
const injector = @import("injector");
const inquirer = @import("inquirer");
const utils = @import("utils");
const Logger = utils.Logger;
const allocator = utils.allocator;
const discord_platform = utils.discord_platform;
const join_path = utils.join_path;
const string = utils.string;
const handle_error = utils.handle_error;

const action_type = enum { inject, uninject };

fn checkIfGitInstalled() !void {
    const argv = &[_]string{ "git", "--version" };
    const child = try std.ChildProcess.init(argv, allocator);
    defer child.deinit();

    child.stdin_behavior = .Close;
    child.stdout_behavior = .Pipe;
    child.stdout = std.io.getStdOut();

    _ = try child.spawn();

    _ = try child.stdout.?.reader().readAllAlloc(allocator, 1024);
}

fn cloneRepo(cwd: string, repo: string, branch: string) !void {
    const argv = &[_]string{ "git", "clone", repo, "-b", branch, "." };
    const child = try std.ChildProcess.init(argv, allocator);
    defer child.deinit();

    child.cwd = cwd;
    child.stdin_behavior = .Close;
    child.stdout_behavior = .Pipe;
    child.stdout = std.io.getStdOut();

    _ = try child.spawn();

    _ = try child.stdout.?.reader().readAllAlloc(allocator, 1024);
}

pub fn main() anyerror!void {
    const in = std.io.getStdIn().reader();
    const out = std.io.getStdOut().writer();

    const action = inquirer.forEnum(out, in, "What do you want?", allocator, action_type, action_type.inject) catch unreachable;

    const platform = inquirer.forEnum(out, in, "Please, select discord platform.", allocator, discord_platform, discord_platform.stable) catch unreachable;

    if (action == action_type.uninject) {
        injector.uninject(@tagName(platform));
        return;
    }

    const hykord_directory = injector.C.get_hykord_default_source_folder();
    const hykord_source_directory = join_path(&.{ hykord_directory, "install" });

    std.fs.makeDirAbsolute(hykord_directory) catch |err| {
        handle_error(err, true);
    };

    std.fs.makeDirAbsolute(hykord_source_directory) catch |err| {
        handle_error(err, true);
    };

    checkIfGitInstalled() catch {
        Logger.err("Hykord wasn't able to inject. Error: Git is not installed", .{});
        return;
    };

    cloneRepo(hykord_source_directory, "https://github.com/xHyroM/hykord.git", "hykord-dist") catch {
        Logger.err("Hykord wasn't able to inject. Error: Failed to clone repository", .{});
        return;
    };

    injector.inject(@tagName(platform), join_path(&.{ hykord_source_directory, "index.js" }));

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
