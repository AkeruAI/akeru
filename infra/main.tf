terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "default" {
  name       = var.ssh_key_name
  public_key = file(var.ssh_public_key_file)
}

resource "digitalocean_droplet" "subtensor" {
  image    = "ubuntu-20-04-x64"
  name     = "example-droplet"
  region   = "nyc1"
  size     = "s-1vcpu-1gb" # Smallest droplet size
  ssh_keys = [digitalocean_ssh_key.default.id]

  user_data = <<-EOF
              #!/bin/bash              
              # Update apt
              sudo apt update
              
              # Install additional required libraries and tools
              sudo apt install --assume-yes make build-essential git clang curl libssl-dev llvm libudev-dev protobuf-compiler

              # Clone the subtensor repository
              git clone https://github.com/opentensor/subtensor.git
              # TODO: add starting the subnet here.
              EOF
}

output "ssh_command" {
  value = "ssh <your_username>@${digitalocean_droplet.subtensor.ipv4_address}"
}
