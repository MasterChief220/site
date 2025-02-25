---
title: How to set up Winlogbeat
description: Setting up Windows Logs for ELK Stack
publishedDate: 2024-11-10
tags:
  - guides
  - SIEM
  - cybersecurity
  - blueteam
---


In the previous tutorial, I explained how to setup Elasticsearch and send logs from Linux Machines. In this tutorial I will tell you how to send logs from Windows Machines. 

# Sysmon

To install Winlogbeat we first need to make use of Sysmon. Sysmon is a Windows system monitoring tool that provides detailed logs of system activity, such as process creation, network connections, and file changes. 

We need to download [Sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon) from here and extract it into Program files, making its folder. We will download sysmon from there by clicking here: 
![How to Install Winlogbeat- Sysmon Download](@/assets/blog/blog2sysmondown.png)

After downloading it we will extract it and then copy the files into a Sysmon folder (after creating it) inside *Program Files*. 

After that, we need a Sysmon config file. We use this [config](https://github.com/SwiftOnSecurity/sysmon-config) file. Just click on the sysmonconfig-export.xml file and then on the 3 dots on the top right. After that, we will download it. We will then paste it into the Sysmon folder in Program Files. We need to remove the *-export*  from the file name, leaving just sysmonconfig .  

> You can go through the configuration file and alter it according to your needs. We will be using this as it is for ease of setup. 


Now we need to switch to that directory and open Command Prompt or Powershell as Administrator. Then run this command: 
   `sysmon -i sysmonconfig.xml -accepteula -h sha256 -l -n` . 

Brief Overview of the command: 
- **`sysmon`**: Launches Sysmon.
- **`-i sysmonconfig.xml`**: Specifies the input configuration file to define what data to monitor.
- **`-accepteula`**: Automatically accepts the Sysmon End User License Agreement.
- **`-h sha256`**: Uses SHA-256 for hashing executables.
- **`-l`**: Logs all captured events to the Windows Event Log.
- **`-n`**: Captures network connection data, logging information about network activity.

> [!Important]
> In some cases terminal might not run the command in which case run it using `.\Sysmon -i sysmonconfig.xml -accepteula -h sha256 -l -n`

We will now open the Services section in Windows. There we need to ensure Sysmon is running. If not, then we will click on it and start it from there. 
![How to Install Winlogbeat - Sysmon Running](@/assets/blog/blog2sysmonrunning.png) 

# Winlogbeat 
Now that we have properly installed Sysmon, it is time to send logs to Elasticsearch. **Winlogbeat**, is part of the Elastic Beats family and is designed to send Windows event logs to Elasticsearch.

We will download [Winlogbeat](https://www.elastic.co/downloads/beats/winlogbeat) from this page and then extract the files into a Winlogbeat folder in program files. **Make sure to rename the folder name to Winlogbeat with the W in upper case**. 

Now making sure we are running PowerShell as admin we will cd into the Winlogbeat folder and run the following command: `.\install-service-winlogbeat.ps1` 

> If we get the error script execution is disabled on your system, you need to set the execution policy for the current session to allow the script to run. For example: `PowerShell.exe -ExecutionPolicy UnRestricted -File ./install-service-winlogbeat.ps1`. Enter R when prompted and click enter. 

If the command works then we will see the following:  
![How to Install Winlogbeat - Winlogbeat Install](@/assets/blog/blog2winlogbeatinst.png) 

Now we head to the config file in the Winlogbeat directory and change some values. The file name is Winlogbeat.yml. You can open it using Notepad or any editor you want. 

Go to the Kibana section and change the IP to that of the machine where you're running Elasticsearch and Kibana. You can check it using `ip addr` if on Linux. The specific line we have to change is host:  "localhost:5601". Leave the port as it is and change the Local host to the IP. 
**Make sure to comment in the line**. 

Now go further down and under Elasticsearch Output change the value of hosts: [localhost:9200]. Once again change the localhost to the IP and leave the port as it is. Now save the file and close your editor.

We will once again open PowerShell as admin and run the following command:  `./winlogbeat.exe setup -e`. 

> Make sure Kibana and Elasticsearch are running on the Linux Machine. You can check them using `sudo service elasticsearch status` and `sudo service kibana status`. If they are not running then start them using start in place of status. 

If the above command was successful then you should get something like the following output: 
![How to Install Winlogbeat - Winlogbeat status](@/assets/blog/blog2winlogbeatstat.png) 


Now login to your Elasticsearch Dashboard and go to Discover under Analytics. There on the top left corner, you should see a Winlogbeat section. Click on it and you should see the logs. 

>[!Important]
>If you do not see anything then ensure Winlogbeat and Sysmon are running by checking services on Windows. If they aren't then run them from there or by running their corresponding executable.  

If everything worked perfectly you should see the following on the dashboard URL. Which should be [_http://YOURIP:5601._](http://YOURIP:5601.)
![How to Install Winlogbeat - Elasticsearch](@/assets/blog/blog2elasticsearch.png) 

# Conclusion 
In essence, this guide helped configure Sysmon to collect system logs and set up Winlogbeat to forward those logs to Elasticsearch, enabling efficient log management and real-time monitoring with Kibana.