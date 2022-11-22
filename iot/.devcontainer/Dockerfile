# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

#Debian and Ubuntu use a package manager called apt, and apt can prompt user for things like file permissions and timezone selection. 
#We need to disable apt from prompting, in order to fully automate docker image building.
ENV DEBIAN_FRONTEND=noninteractive

# WORKDIR /ae-iot/iot
ENV TZ=Europe/Oslo

COPY install/requirements.txt requirements.txt
# RUN apt-get update -y
# RUN apt-get install -y \
#                     gcc build-essential \
#                     cron \
#                     nano
# Install dependencies.
RUN apt-get -y update --no-install-recommends \
    && apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    ca-certificates \
    apt-utils \
    git \
    sudo \
    && apt-get autoremove -y \
    && apt-get clean -y

RUN pip3 install -r requirements.txt

# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create the user.
# RUN groupadd --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

# USER $USERNAME

# CMD [ "tail", "-f", "/var/log/cron.log"]
