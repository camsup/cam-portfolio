use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: subnet-calc <CIDR>");
        eprintln!("Example: subnet-calc 192.168.1.0/24");
        std::process::exit(1);
    }

    match parse_cidr(&args[1]) {
        Ok(info) => print_subnet_info(info),
        Err(e) => {
            eprintln!("Error: {}", e);
            std::process::exit(1);
        }
    }
}

struct SubnetInfo {
    ip: [u8; 4],
    prefix: u8,
    network_addr: u32,
    broadcast_addr: u32,
    subnet_mask: u32,
    total_hosts: u64,
    usable_hosts: u64,
}

fn parse_cidr(cidr: &str) -> Result<SubnetInfo, String> {
    // Split "192.168.1.50/24" into ip and prefix parts
    let parts: Vec<&str> = cidr.split('/').collect();
    if parts.len() != 2 {
        return Err(format!("'{}' is not valid CIDR notation (e.g. 192.168.1.0/24)", cidr));
    }

    // Parse the prefix length (e.g. "24")
    let prefix: u8 = parts[1]
        .parse()
        .map_err(|_| format!("Invalid prefix length: '{}'", parts[1]))?;

    if prefix > 32 {
        return Err(format!("Prefix length {} is out of range (must be 0-32)", prefix));
    }

    // Parse the IP octets into [u8; 4]
    let octets: Vec<&str> = parts[0].split('.').collect();
    if octets.len() != 4 {
        return Err(format!("'{}' is not a valid IPv4 address", parts[0]));
    }

    let mut ip = [0u8; 4];
    for (i, octet) in octets.iter().enumerate() {
        ip[i] = octet
            .parse()
            .map_err(|_| format!("Invalid octet: '{}'", octet))?;
    }

    // Convert IP to a single u32 for bit math
    // e.g. 192.168.1.50 -> 0xC0A80132
    let ip_u32 = u32::from_be_bytes(ip);

    // Build subnet mask from prefix length using bit shifting
    // e.g. prefix=24 -> 0xFFFFFF00
    let subnet_mask: u32 = if prefix == 0 {
        0
    } else {
        !0u32 << (32 - prefix)
    };

    // Network address = IP AND mask (zeroes out host bits)
    let network_addr = ip_u32 & subnet_mask;

    // Broadcast = network address OR NOT mask (sets all host bits to 1)
    let broadcast_addr = network_addr | !subnet_mask;

    // Total addresses in the block — use u64 because /0 = 2^32 overflows u32
    let total_hosts: u64 = 1u64 << (32 - prefix as u64);

    // Usable = total minus network and broadcast addresses
    let usable_hosts: u64 = if total_hosts > 2 { total_hosts - 2 } else { 0 };

    Ok(SubnetInfo {
        ip,
        prefix,
        network_addr,
        broadcast_addr,
        subnet_mask,
        total_hosts,
        usable_hosts,
    })
}

fn u32_to_ip(n: u32) -> String {
    let bytes = n.to_be_bytes();
    format!("{}.{}.{}.{}", bytes[0], bytes[1], bytes[2], bytes[3])
}

fn print_subnet_info(info: SubnetInfo) {
    let input_ip = format!("{}.{}.{}.{}", info.ip[0], info.ip[1], info.ip[2], info.ip[3]);

    println!();
    println!("  Input IP       : {}/{}", input_ip, info.prefix);
    println!("  Subnet Mask    : {}", u32_to_ip(info.subnet_mask));
    println!("  Network Addr   : {}", u32_to_ip(info.network_addr));
    println!("  Broadcast Addr : {}", u32_to_ip(info.broadcast_addr));

    // First usable host = network + 1
    if info.usable_hosts > 0 {
        println!("  First Host     : {}", u32_to_ip(info.network_addr + 1));
        println!("  Last Host      : {}", u32_to_ip(info.broadcast_addr - 1));
    }

    println!("  Total Addresses: {}", info.total_hosts);
    println!("  Usable Hosts   : {}", info.usable_hosts);
    println!();
}
