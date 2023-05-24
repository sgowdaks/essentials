# Some usefull bash commands:
* `paste -d ',' new_meta_166.csv out.txt` > new_data.csv  = pasting 2 files "," delimeter
* `cat meta_166.csv | sed "s/\r//g" > new_meta_166.csv` = sed(stream editor) from start to all the globals (for windows to unix)
* `wc -l` = counting the number of lines in a file
* `seq -1 10` = for getting numbers from -1 to 10
* `ls ../img/*/ -d | while read i; do for j in $i/*.jpg; do cp $j .; done; done` ^C = to copy all the images in a directory's subdirectory
* `grep -o -E "(\w)+" file_name.csv | sort | uniq -c | sort -nr > unique.txt` -> to find the unique words in a file, with dictinorey
* `Get-NetAdapter | Where-Object {$_.InterfaceDescription -Match "Cisco AnyConnect"} | Set-NetIPInterface -InterfaceMetric 6000` --> to make internet work on Cisco VPN (for windows)
* `jupyter lab  --ip 0.0.0.0` (strting jupyter lab from server) 
* `gpustat -i 0.5`  -> to check GPU utilization
* `code-server --bind-addr 0.0.0.0:8080` -> to start code-server
* `lsof -i :<port number>` -> for obtaining PID with process ID
* `jobs` -> lists out all the jobs
* `fg` -> foreground, brings the recently backgrounded process to the front
* `ln -s [source] [destination]` -> symbolic_link
* `ls -d img_166/*/ | while read i; do ls -1 $i/*.jpg; done > output.txt` -> to copy the path of all images in a subdirectory to an output file (ex: img_166/xyz/xyzz.jpg)
* `shuf output.txt > output_shuf.txt` -> To shuffel lines indside a text file
* `sed '1,660d' train.txt > test.txt` -> copy lines 1 to 660 from train.txt and put it to text.txt
* `j=$(echo $i | awk -F '/' '{print $2}')` -> giving the 2nd feild
* `cat paths.val.txt | while read i; do  j=val/$(echo $i | awk -F '/' '{print $2}')/; if [[ ! -d $j ]]; then mkdir $j; fi; echo "cp ../$i $j"; done'` -> 
   each path from val is taken, and inide val folder we are extracting the 2nd feild, then we are checking if the feild is alredy created, if not we will create else      we wont, echo is just prinitng the path. 
* `cut -f2 data/orig/english_dataset/UC_berkley/dataset_validation.tsv | sort |  uniq -c` -> cuts and gets 2nd charecter (cuts default on tab) sort and then get unique values (will give you count)
* ` paste diet_tracking_food.txt output.tsv | sed 's/\r//g' > main_output.tsv` -> place 2 files side by side and remove the '\r'
* `sed -i '1d' file.tsv` -> to remove the first line in a tsv file
* `sudo chown -Rv sg:sg combo-actual6langs` -> changing the ownership of the folder
* `gpustat -cpu` -> show all the process that is currently running
* `sudo pkill -f <name>` -> kill the process with name 
* `ssh -L <port number>:localhost:<port number> dvbx` -> binding a port number in server to local machine (port forwarding) 
* `for dir in */; do cat "$dir"/*.txt > "${dir%/}_overall.txt"; done` -> combining files inside every folder to a singel file `%/`  removes the trailing slash from the value of the dir
* `sort <input_file> | uniq > <output_file>` ->  remove duplicates in a file
* `sed -i 's/\r//' filename` -> remove the carrys in a file inplace
* `split -a 4 -d --additional-suffix=.txt -l 10000 output.1M.txt data-parts/part-` -> (-a 4: specifies the suffix length to be 4 characters long, -d: should be a numeric suffixes, should be in .txt format, each should consists 10000 lines, and output.1M.txt is the file to be used, should go inside the folder data-parts/parts-)
* `cat output.shuf.txt | awk 'NF>=5' | head -1000000` -> sentences with more than 5 words and only the first 1 million lines.
   
## ssh
* `scp berkley_data.tsv dvbx:/home/sg/work/ps/data` -> for copying a file my local to remote machine
* `scp -r sks@****:/home/**/ .` = for downloading files inside directory, from server.
* `scp -i ~/.ssh/filename.pem pixai.tar.gz ubtu@00.000.000.000:<folder name>` => move using .pem file
* `cat ~/.ssh/config` -> setting up config file
* `Host dvbx
  User sg
  HostName 192.000.0.000 `  -> creating alias in your config file
* `lsof -i :5000` -> list of process with 5000 port number
  
## Docker
* `docker container ls` -> lists all the docker files
* `docker stop <CONTAINER ID>` -> remove a running container
  
## awk
NR -> number of record
$0 -> literally prints that line itself
NF -> number of feilds
* `head shuf_output.txt  | awk '{print NR,"--->  "$0;}'` -> prints the record number + the -----> and first line itself (ex: 1 --->  img_166/eggs_benedict//7791.jpg)
* `cat shuf_output.txt  | awk 'NR > 1000 && NR < 10000'` -> prints all the record that is greater than 1000 and less then 10000
* `head shuf_output.txt  | awk -F '/' '{print NF}'` -> prints the number of feild for each line
* `head shuf_output.txt  | awk -F '/' '{print $0}'` -> prints everything in first feild
* `head shuf_output.txt  | awk -F '/' '{print $1}'` -> prints everything in second feild
* `cat output_vilt_single_label.txt | awk -v ORS='' '{print $0, NR % 2 ? "\t": "\n"}'  | sed 's/predicted answer:  //;s/actual answer : //' > output_vilt_single_label.tsv` -> converts (pred = "" (nextline) ground = "") to tab seperated format.   
* `awk -v col=<new column number (colum no. begins with 1)> -v val="<column value>" 'BEGIN {FS=OFS="\t"} {$col=val; print}' data.tsv` -> awk command to add a new couln to a existing file
* `awk 'BEGIN {OFS="\t"} {print $0, "X", "Y"}' data.tsv` -> awk command to add 2 new columns seprated by tab, add column at the end.
* `awk '{printf "%.0f\n", $1}' file.txt` -> command  to convert the first feild float to int
* `shuf input.tsv | tee >(awk 'NR <= 10000' > output1.tsv) | awk 'NR > 10000' > output2.tsv` -> shuffel the file and put the first 1000 to one directory and the rest to another file. `tee` command for changing the process from shuffel to awk, NR (no. of records) 
* `awk -F '\t' 'BEGIN {OFS = FS} { $2=int($2); print }' dataset_validation.tsv > validation.tsv` -> in a tsv file convert 2nd field float to int
* `awk -F '\t' 'BEGIN {OFS = FS} {print "[\047salad\047, \047smoothie\047, \047sandwich\047]"}' one_majority_smoothie.tsv > one_majority_smoothie1.tsv `
* `paste one_majority_smoothie.tsv one_majority_smoothie1.tsv  > one_majority_smoothie2.tsv`

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
* Moniter CPU  -> `htop`
* Moniter GPU -> 
  * `nvidia-smi`
  * `gpustat`
* `free -h` -> RAM in computer
* `df -h` -> for memory available
* `export CUDA_VISIBLE_DEVICES=<dive number(0/1/2)`  -> to set a particular GPU machine
* `ncdu`

## Emacs
* `ctrl X + ctrl s` -> to save a file
* `ctrl X + ctrl c` -> to exit the file

## Code server
`ctrl+shift+p` -> to open command pannel in code server

## tar, gunzip and untar, unzip file
* `tar -cvzf <to be named as>.tar.gz <file path/name>`
* `gunzip filename.tar.gz`
* `tar -xvf filename.tar`

