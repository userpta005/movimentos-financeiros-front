<style lang="scss" scoped>
.q-field :deep(.q-field__control::before) {
  border-left: 0 !important;
  border-right: 0 !important;
  border-radius: 0px;
}
.q-field :deep(.q-field__control::after) {
  border-left: 0 !important;
  border-right: 0 !important;
  border-radius: 0px;
}
.q-field :deep(.q-field__control-container) {
  padding-top: 0 !important;
}
</style>

<template>
  <q-field outlined>
    <template #control>
      <div id="toolbar">
        <span class="ql-formats">
          <select class="ql-font" />
          <select class="ql-size" />
        </span>
        <span class="ql-formats">
          <button class="ql-bold" />
          <button class="ql-italic" />
          <button class="ql-underline" />
          <button class="ql-strike" />
        </span>
        <span class="ql-formats">
          <select class="ql-color" />
          <select class="ql-background" />
        </span>
        <span class="ql-formats">
          <button
            class="ql-script"
            value="sub"
          />
          <button
            class="ql-script"
            value="super"
          />
        </span>
        <span class="ql-formats">
          <button
            class="ql-header"
            value="1"
          />
          <button
            class="ql-header"
            value="2"
          />
          <button class="ql-blockquote" />
          <button class="ql-code-block" />
        </span>
        <span class="ql-formats">
          <button
            class="ql-list"
            value="ordered"
          />
          <button
            class="ql-list"
            value="bullet"
          />
          <button
            class="ql-indent"
            value="-1"
          />
          <button
            class="ql-indent"
            value="+1"
          />
        </span>
        <span class="ql-formats">
          <button
            class="ql-direction"
            value="rtl"
          />
          <select class="ql-align" />
        </span>
        <span class="ql-formats">
          <button class="ql-link" />
          <!-- <button class="ql-image" /> -->
          <button class="ql-video" />
          <button class="ql-formula" />
        </span>
        <span class="ql-formats">
          <button class="ql-clean" />
        </span>
      </div>
    </template>
  </q-field>
</template>
