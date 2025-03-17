# Simple VPN Client

This VPN client creates an encrypted tunnel for your internet traffic. Here's how it works:

1. Creates a virtual network interface (TUN device) on your computer
2. Establishes an encrypted connection to a VPN server
3. Routes your traffic through this encrypted tunnel

## How it Works

1. The TUN device acts as a virtual network card
2. All traffic goes through the encrypted tunnel to the VPN server
3. Data is encrypted using AES-CBC encryption before transmission
4. The VPN server forwards your traffic to the internet

## Setup Instructions

1. Install Node.js if you haven't already
2. Install dependencies:
```bash
npm install
```

3. You need root/admin privileges to create the TUN device:

On Linux/Mac:
```bash
sudo node client.js
```

On Windows:
Run Command Prompt as Administrator:
```bash
node client.js
```

## Important Notes

- You need to change `vpn-server-address` in client.js to your actual VPN server address
- The default port is 1194 (standard VPN port)
- The encryption key is hardcoded as 'your-secret-key' - change this in production
- This is a basic implementation - use established VPN solutions for real privacy needs
