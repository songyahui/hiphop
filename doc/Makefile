#*=====================================================================*/
#*    serrano/prgm/project/hop/weblets/hopimpress/doc/Makefile         */
#*    -------------------------------------------------------------    */
#*    Author      :  Manuel Serrano                                    */
#*    Creation    :  Mon Nov 16 10:15:32 2015                          */
#*    Last change :  Thu Nov 19 09:55:40 2015 (serrano)                */
#*    Copyright   :  2015 Manuel Serrano                               */
#*    -------------------------------------------------------------    */
#*    Build the documentation                                          */
#*=====================================================================*/
HOP=hop
DOCJS=`$(HOP) --no-server --evaljs 'console.log( require( hop.config ).docDir + "/doc.js" )'`

#*---------------------------------------------------------------------*/
#*    Targets                                                          */
#*---------------------------------------------------------------------*/
API_TARGETS=get-started.html user-api.html devel-api.html
TARGETS=index.html idx.html api.html download.html $(API_TARGETS)

all: $(TARGETS) lib hss

lib: $(TARGETS)
	cp -r `$(HOP) --no-server --evaljs 'console.log( require( hop.config ).docDir + "/lib" )'` .

hss:
	cp -r `$(HOP) --no-server --evaljs 'console.log( require( hop.config ).docDir + "/hss" )'` .

#*---------------------------------------------------------------------*/
#*    Suffixes                                                         */
#*---------------------------------------------------------------------*/
.SUFFIXES: .md .html .json

#*---------------------------------------------------------------------*/
#*    Search path                                                      */
#*---------------------------------------------------------------------*/
VPATH=api

#*---------------------------------------------------------------------*/
#*    doc                                                              */
#*---------------------------------------------------------------------*/
index.html: _index.md
	$(HOP) $(EFLAGS) -q --no-clear-cache --no-cache --no-server -- \
          $(DOCJS) "compile-library" $< > $@ \
          || ($(RM) $@; exit 1)

#*---------------------------------------------------------------------*/
#*    idx.json ...                                                     */
#*---------------------------------------------------------------------*/
idx.json: $(API_TARGETS)
	$(HOP) $(EFLAGS) -q --no-clear-cache --no-cache --no-server -- \
          $(DOCJS) "html-to-idx" . $^ > $@ \
          || ($(RM) $@; exit 1)

#*---------------------------------------------------------------------*/
#*    idx.html ...                                                     */
#*---------------------------------------------------------------------*/
idx.html: idx.json
	$(HOP) $(EFLAGS) -q --no-clear-cache --no-cache --no-server -- \
          $(DOCJS) "compile-idx" $^ > $@ \
          || ($(RM) $@; exit 1)

#*---------------------------------------------------------------------*/
#*    .md -> .html                                                     */
#*---------------------------------------------------------------------*/
%.html: %.md
	$(HOP) $(EFLAGS) -q --no-clear-cache --no-cache --no-server -- \
          $(DOCJS) "compile-section" $< > $@ \
          || ($(RM) $@; exit 1)

#*---------------------------------------------------------------------*/
#*    .json -> .html                                                   */
#*---------------------------------------------------------------------*/
%.html: %.json
	$(HOP) $(EFLAGS) -q --no-clear-cache --no-cache --no-server -- \
          $(DOCJS) "compile-chapter" $< > $@ \
          || ($(RM) $@; exit 1)

#*---------------------------------------------------------------------*/
#*    clean                                                            */
#*---------------------------------------------------------------------*/
clean:
	$(RM) $(TARGETS)
	$(RM) -f idx.json
	$(RM) -rf lib hss

cleanall: clean
	$(RM) doc.json