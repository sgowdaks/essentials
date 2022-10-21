# Some usefull bash commands:
* `paste -d ',' new_meta_166.csv out.txt` > new_data.csv  = pasting 2 files "," delimeter
* `cat meta_166.csv | sed "s/\r//g" > new_meta_166.csv` = sed(stream editor) from start to all the globals (for windows to unix)
* `wc - l` = counting the number of lines in a file
* `seq -1 10` = for getting numbers from -1 to 10
* `scp -r sks@****:/home/**/ .` = for downloading files inside directory, from server.
* `ls ../img/*/ -d | while read i; do for j in $i/*.jpg; do cp $j .; done; done` ^C = to copy all the images in a directory's subdirectory
* `grep -o -E "(\w)+" file_name.csv | sort | uniq -c | sort -nr > unique.txt` -> to find the unique words in a file, with dictinorey
* `Get-NetAdapter | Where-Object {$_.InterfaceDescription -Match "Cisco AnyConnect"} | Set-NetIPInterface -InterfaceMetric 6000` --> to make internet work on Cisco VPN
* `jupyter lab  --ip 0.0.0.0` (strting jupyter lab from server) 
* `gpustat -i 0.5`  -> to check GPU utilization
* `code-server --bind-addr 0.0.0.0:8080` -> to start code-server
* `lsof -i :<port number>` -> for obtaining PID with process ID
* `jobs` -> lists out all the jobs
* `fg` -> foreground, brings the recently backgrounded process to the front
* `ln -s [source] [destination]` -> symbolic_link
* `ls -d img_166/*/ | while read i; do ls -1 $i/*.jpg; done > output.txt` -> to copy the path of all images in a subdirectory to an output file (ex: img_166/xyz/xyzz.jpg)

## Tmux
* `Ctrl b + 0/1/2/3...` -> to switch windows in one session
* `Ctrl b + c` -> create new window in same session 
* `Ctrl b + d` -> dettach from session
* `tmux a` -> tmux attach session
* `tmux ls` -> list of session in tmux
* `Ctrl b + %` -> for splitting the window vertically
* `Ctrl b + left/right arrow` -> to switch bwt panels
* `Ctrl b + [` -> starts scrolling, and up and down arrow, `q` -> to quit
* `Ctrl b + Ctrl left/right` -> to window resize

## Monetering resources
* Moniter CPU and RAM -> `htop`
* Moniter GPU -> 
  * `nvidia-smi`
  * `gpustat`
* `free -h` ->  RAM in computer
* `export CUDA_VISIBLE_DEVICES=1`  -> to set a particular GPU machine

## Emacs
* `ctrl X + ctrl s` -> to save a file
* `ctrl X + ctrl c` -> to exit the file

## Code server
`ctrl+shift+p` -> to open command pannel in code server

