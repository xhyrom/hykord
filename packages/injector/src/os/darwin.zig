const std = @import("std");
const utils = @import("utils");
const Logger = utils.Logger;
const string = utils.string;
const global = @import("../global.zig");
const discord_platform = global.discord_platform;
const join_path = global.join_path;
const allocator = std.heap.page_allocator;

pub fn get_app_directory(platform: discord_platform) string {
    var searched: ?string = null;
    switch(platform) {
        .stable => searched = "/Applications/Discord.app/Contents/Resources/app",
        .ptb => searched = "/Applications/Discord PTB.app/Contents/Resources/app",
        .canary => searched = "/Applications/Discord Canary.app/Contents/Resources/app",
        .development => searched = "/Applications/Discord Development.app/Contents/Resources/app",
    }

    var asked = false;
    while (searched == null or std.os.system.access(allocator.dupeZ(u8, searched.?) catch unreachable, std.os.F_OK) != 0) {
        Logger.err("Failed to locate discord {s} installation folder.", .{@tagName(platform)});
        Logger.infoNoBreak("Please, write your discord path: ", .{});
        searched = std.io.getStdIn().reader().readUntilDelimiterAlloc(allocator, '\n', 1024) catch unreachable;
        asked = true;
    }

    return if (asked) join_path(&.{searched.?, "Resources", "app"}) else searched.?;
}