import json
import csv
import shutil

csv_path = open("feature.csv","r")
csv_reader = csv.reader(csv_path)

row_count = 0
#aasdasd
for row in csv_reader:

    if( row_count >= 1 ):
        #from CSV
        structure_id = row[0]
        structure_loadx = int(row[1])
        structure_loadz = int(row[2])

        with open("{}.mcfunction".format(structure_id),"w") as f:
            f.write("tickingarea add ~~~ ~{0}~63~{1} zexfeature true\n".format(structure_loadx+16,structure_loadz+16))
            f.write("structure load {} ~~~\n".format(structure_id))
            if( structure_loadx > 64 ): f.write("structure load {}_x64 ~64~~\n".format(structure_id))
            if( structure_loadz > 64 ): f.write("structure load {}_z64 ~~~64\n".format(structure_id))
            if( structure_loadx > 64 and structure_loadz > 64 ): f.write("structure load {}_x64z64 ~64~~64\n".format(structure_id))
            f.write("fill ~{0} ~64 ~{1} ~{0} ~64 ~{1} zex:structure_end\n".format(structure_loadx-1,structure_loadz-1))


    
    row_count += 1