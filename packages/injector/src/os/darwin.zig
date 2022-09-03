const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const global = @import("../global.zig");
const discord_platform = utils.discord_platform;
const join_path = utils.join_path;
const allocator = utils.allocator;

pub fn does_file_exist(file: string) bool {
    return std.os.system.access(allocator.dupeZ(u8, file) catch unreachable, std.os.F_OK) == 0;
}

pub fn get_hykord_default_source_folder() string {
    const home = std.os.getenv("HOME") orelse "unknown";

    return join_path(&.{home, ".hykord"});
}

pub fn get_app_directory(platform: discord_platform) string {
    var searched: ?string = null;
    switch(platform) {
        .stable => searched = "/Applications/Discord.app/Contents/Resources/app",
        .ptb => searched = "/Applications/Discord PTB.app/Contents/Resources/app",
        .canary => searched = "/Applications/Discord Canary.app/Contents/Resources/app",
        else => searched = "/Applications/Discord Development.app/Contents/Resources/app",
    }

    var asked = false;
    while (searched == null or !does_file_exist(searched.?)) {
        Logger.err("Failed to locate discord {s} installation folder.", .{@tagName(platform)});
        Logger.infoNoBreak("Please, write your discord path: ", .{});
        searched = std.io.getStdIn().reader().readUntilDelimiterAlloc(allocator, '\n', 1024) catch unreachable;
        asked = true;
    }

    return if (asked) join_path(&.{searched.?, "Resources", "app"}) else searched.?;
}