const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const homedir_ = utils.homedir;
const global = @import("../global.zig");
const discord_platform = global.discord_platform;
const join_path = global.join_path;
const allocator = std.heap.page_allocator;

fn search(array: [5][]const u8) ?utils.string {
    for (array) |character| {
        if (std.os.system.access(allocator.dupeZ(u8, character) catch unreachable, std.os.F_OK) == 0) return character;
    }

    return null;
}

pub fn does_file_exist(file: string) bool {
    return std.os.system.access(allocator.dupeZ(u8, file) catch unreachable, std.os.F_OK) == 0;
}

pub fn get_app_directory(platform: discord_platform) string {
    const homedir = homedir_();
    const stablePaths = [_]string{ "/usr/share/discord", "/usr/lib64/discord", "/opt/discord", "/opt/Discord", std.fmt.allocPrint(allocator, "{s}/.local/bin/Discord", .{homedir}) catch unreachable};
    const ptbPaths = [_]string{ "/usr/share/discord-ptb", "/usr/lib64/discord-ptb", "/opt/discord-ptb", "/opt/DiscordPTB", std.fmt.allocPrint(allocator, "{s}/.local/bin/DiscordPTB", .{homedir}) catch unreachable };
    const canaryPaths = [_]string{ "/usr/share/discord-canary", "/usr/lib64/discord-canary", "/opt/discord-canary", "/opt/DiscordCanary",std.fmt.allocPrint(allocator, "{s}/.local/bin/DiscordCanary", .{homedir}) catch unreachable };
    const developmentPaths = [_]string{ "/usr/share/discord-development", "/usr/lib64/discord-development", "/opt/discord-development", "/opt/DiscordDevelopment", std.fmt.allocPrint(allocator, "{s}/.local/bin/DiscordDevelopment", .{homedir}) catch unreachable };
    
    var searched: ?string = null;
    switch(platform) {
        .stable => searched = search(stablePaths),
        .ptb => searched = search(ptbPaths),
        .canary => searched = search(canaryPaths),
        else => searched = search(developmentPaths),
    }

    while (searched == null or !does_file_exist(searched.?)) {
        Logger.err("Failed to locate discord {s} installation folder.", .{@tagName(platform)});
        Logger.infoNoBreak("Please, write your discord path: ", .{});
        searched = std.io.getStdIn().reader().readUntilDelimiterAlloc(allocator, '\n', 1024) catch unreachable;
    }

    return join_path(&.{searched.?, "resources", "app"});
}