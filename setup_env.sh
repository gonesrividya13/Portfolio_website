#!/bin/bash

# Setup script for AI Portfolio environment dependencies on macOS
# This script checks and installs Homebrew, Node.js/npm, Java OpenJDK 17, and Maven.

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0;3m' # No Color
CLEAR='\033[0m'

echo -e "${BLUE}=== AI Developer Portfolio: Environment Setup ===${CLEAR}"

# 1. Check for Homebrew
if ! command -v brew &>/dev/null; then
    echo -e "${RED}[x] Homebrew is not installed.${CLEAR}"
    echo -e "Homebrew is required to install Node.js and Java. Please run the following command in your terminal:"
    echo -e "${BLUE}/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${CLEAR}"
    echo -e "After installing Homebrew, re-run this script."
    exit 1
else
    echo -e "${GREEN}[✓] Homebrew is installed: $(brew --version | head -n 1)${CLEAR}"
fi

# 2. Install Node.js & npm
if ! command -v node &>/dev/null; then
    echo -e "${BLUE}[i] Installing Node.js & npm...${CLEAR}"
    brew install node
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[✓] Node.js successfully installed!${CLEAR}"
    else
        echo -e "${RED}[x] Failed to install Node.js.${CLEAR}"
        exit 1
    fi
else
    echo -e "${GREEN}[✓] Node.js is installed: $(node --version)${CLEAR}"
fi

# 3. Install OpenJDK 17
if ! java -version &>/dev/null && [ ! -d "/Library/Java/JavaVirtualMachines/openjdk-17.jdk" ]; then
    echo -e "${BLUE}[i] Installing Java OpenJDK 17...${CLEAR}"
    brew install openjdk@17
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[✓] OpenJDK 17 successfully installed!${CLEAR}"
        # Link OpenJDK 17 so system wrapper can find it
        sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
    else
        echo -e "${RED}[x] Failed to install OpenJDK 17.${CLEAR}"
        exit 1
    fi
else
    echo -e "${GREEN}[✓] Java OpenJDK is installed.${CLEAR}"
fi

# 4. Install Maven
if ! command -v mvn &>/dev/null; then
    echo -e "${BLUE}[i] Installing Maven...${CLEAR}"
    brew install maven
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[✓] Maven successfully installed!${CLEAR}"
    else
        echo -e "${RED}[x] Failed to install Maven.${CLEAR}"
        exit 1
    fi
else
    echo -e "${GREEN}[✓] Maven is installed: $(mvn --version | head -n 1)${CLEAR}"
fi

echo -e "${GREEN}==============================================${CLEAR}"
echo -e "${GREEN}✓ Environment setup check completed successfully!${CLEAR}"
echo -e "You can now run: npm (frontend) and mvn (backend) commands.${CLEAR}"
echo -e "${GREEN}==============================================${CLEAR}"
